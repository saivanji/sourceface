import * as futures from "../futures";
import * as slices from "../slices";
import {
  isSettingStale,
  getStage,
  getStageName,
  getValue,
  getModuleType,
  getAtom,
  getAtoms,
  getSetting,
  getFieldStageIds,
  getAttribute,
} from "../selectors";
import { ImpureComputation } from "../exceptions";
import {
  mapObjectAsync,
  reduceAsync,
  pathAsync,
  mapAsync,
  pipe,
  all,
} from "./common";
import { makeAtomsDependencies } from "./dependencies";

/**
 * Providing defaults to dependencies object
 */
function defaultOpts(opts) {
  return {
    pure: opts?.pure || false,
    forceComputation: opts?.forceComputation || false,
  };
}

/**
 * Compute specific setting for given stage ids.
 */
export function computeSetting(moduleId, field, { deps, opts, scope }) {
  opts = defaultOpts(opts);

  /**
   * Returning cached data if it exists and not stale unless "forceComputation"
   * is specified.
   */
  const cached = getSetting(deps.state, [moduleId, field]);
  const isStale = isSettingStale(deps.state, [moduleId, field]);

  if (!opts.forceComputation && cached && !isStale) {
    return cached;
  }

  const stageIds = getFieldStageIds(deps.state, [moduleId, field]);
  let stages = {};

  return pipe(
    reduceAsync(
      (_, stageId) => {
        const nextScope = { ...scope, stages };

        return pipe(
          computeSingleStage(stageId, { deps, opts, scope: nextScope }),
          (data) => {
            /**
             * Adding stage result to the scope object.
             */
            const stageName = getStageName(deps.state, stageId);
            stages[stageName] = data;

            return data;
          }
        );
      },
      null,
      stageIds
    ),
    (data) => {
      /**
       * When in pure mode and dispatch is supplied - populating settings
       * state with new data.
       */
      if (deps.dispatch && !opts.pure) {
        deps.dispatch(
          slices.settings.actions.populate({
            moduleId,
            field,
            data,
          })
        );
      }

      return data;
    }
  );
}

/**
 * Computes specific stage data
 */
export function computeSingleStage(stageId, { deps, opts, scope }) {
  const stage = getStage(deps.state, stageId);

  if (stage.type === "value") {
    const valueId = stage.values.root;
    return computeValue(valueId, { deps, opts, scope });
  }

  if (stage.type === "dictionary") {
    return mapObjectAsync((valueId) => {
      return computeValue(valueId, { deps, opts, scope });
    }, stage.values);
  }
}

/**
 * Computes value data.
 */
export function computeValue(valueId, { deps, opts, scope }) {
  const value = getValue(deps.state, valueId);
  const p = value.path || [];

  /**
   * Making sure we do not perform impure computations
   * in pure mode.
   */
  if (
    opts.pure &&
    (value.category === "function/future" ||
      value.category === "function/effect" ||
      value.category === "function/method")
  ) {
    throw new ImpureComputation();
  }

  if (value.category === "variable/constant") {
    const data = value.payload.value;
    return pathAsync(p, data);
  }

  if (value.category === "variable/attribute") {
    const { property } = value.payload;
    const moduleId = value.references.modules.module;

    const data = computeAttribute(moduleId, property, { deps, opts, scope });
    return pathAsync(p, data);
  }

  if (value.category === "variable/input") {
    return pathAsync(p, scope?.input);
  }

  if (!opts.pure && value.category === "function/future") {
    const { execute } = futures[value.payload.kind];
    const { args = {} } = value;

    // TODO: restrict function calls
    const resultArgs = mapObjectAsync(
      (valueId) => computeValue(valueId, { deps, opts, scope }),
      args
    );

    // TODO: pass down and compute arguments
    // TODO: return cached values instead of execution if they exist in the state.
    // TODO: apply loader on a "future" level
    return pipe(resultArgs, (args) => {
      return execute(args, value.references).then((response) => {
        // TODO: how to invalidate cache at that point?
        // TODO: most likely invalidation should be performed on a future and not on the operation
        // level, since "controller" kind of future may also need invalidation

        return pathAsync(p, response.data);
      });
    });
  }

  if (!opts.pure && value.category === "function/method") {
    const { property } = value.payload;
    const moduleId = value.references.modules.module;
    const { args = {} } = value;

    const atoms = getAtoms(deps.state, moduleId);
    const moduleType = getModuleType(deps.state, moduleId);
    const {
      call,
      settings = [],
      attributes = [],
    } = deps.stock[moduleType].methods[property];

    const resultSettings = mapAsync(
      (field) => computeSetting(moduleId, field, { deps, opts, scope }),
      settings
    );
    const resultAttributes = mapAsync(
      (key) => computeAttribute(moduleId, key, { deps, opts, scope }),
      attributes
    );
    // TODO: restrict function calls
    const resultArgs = mapObjectAsync(
      (valueId) => computeValue(valueId, { deps, opts, scope }),
      args
    );

    return all(
      [resultSettings, resultAttributes, resultArgs],
      ([settings, attributes, args]) => {
        const batch = (fragment) => {
          const dependencies = makeAtomsDependencies(
            deps.state,
            moduleId,
            atoms
          );

          deps.dispatch(
            slices.atoms.actions.updateMany({
              moduleId,
              fragment,
              dependencies,
            })
          );
        };

        return call(args, { batch, atoms, settings, attributes });
      }
    );
  }

  // function/future, for operations and other async things
  // function/effect - for displaying notifications, making redirects doing other stuff
  // both future and effect are not applicable for the preload computation
  // TODO: should module function type be part of effect?
}

/**
 * Applies attribute selector of a specific module. Computes dependent
 * settings if they're not found in state. When computation is async,
 * then function will return a Promise.
 */
export function computeAttribute(moduleId, key, { deps, opts, scope }) {
  opts = defaultOpts(opts);

  /**
   * Returning cached data if it exists unless "forceComputation"
   * is specified.
   */
  const cached = getAttribute(deps.state, [moduleId, key]);

  // TODO: should consider staleness same way is done in setting?
  if (!opts.forceComputation && cached) {
    return cached;
  }

  const moduleType = getModuleType(deps.state, moduleId);
  const {
    selector,
    attributes = [],
    settings = [],
    atoms = [],
  } = deps.stock[moduleType].attributes[key];

  const resultAttributes = mapAsync(
    (key) => computeAttribute(moduleId, key, { deps, opts, scope }),
    attributes
  );

  const resultSettings = mapAsync(
    (field) => computeSetting(moduleId, field, { deps, opts, scope }),
    settings
  );

  const resultAtoms = atoms.map((key) => getAtom(deps.state, [moduleId, key]));

  return pipe(
    all(
      [resultSettings, resultAttributes],
      ([resultSettings, resultAttributes]) =>
        selector({
          atoms: resultAtoms,
          settings: resultSettings,
          attributes: resultAttributes,
        })
    ),
    (data) => {
      /**
       * When in pure mode and dispatch is supplied - populating attributes
       * state with new data.
       */
      if (deps.dispatch && !opts.pure) {
        deps.dispatch(
          slices.attributes.actions.populate({
            moduleId,
            key,
            data,
          })
        );
      }

      return data;
    }
  );
}
