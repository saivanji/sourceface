import * as futures from "../futures";
import {
  isSettingStale,
  getStage,
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
  then,
  all,
} from "./common";

/**
 * Compute specific setting for given stage ids.
 */
export function computeSetting(moduleId, field, state, stock, pure = false) {
  const stageIds = getFieldStageIds(state, [moduleId, field]);

  return reduceAsync(
    (_, stageId) => computeSingleStage(stageId, state, stock, pure),
    null,
    stageIds
  );
}

/**
 * Computes specific stage data
 */
export function computeSingleStage(stageId, state, stock, pure) {
  const stage = getStage(state, stageId);

  if (stage.type === "value") {
    const valueId = stage.values.root;
    return computeValue(valueId, state, stock, pure);
  }

  if (stage.type === "dictionary") {
    return mapObjectAsync((valueId) => {
      return computeValue(valueId, state, stock, pure);
    }, stage.values);
  }
}

/**
 * Computes value data.
 */
export function computeValue(valueId, state, stock, pure) {
  const value = getValue(state, valueId);
  const p = value.path || [];

  /**
   * Making sure we do not perform impure computations
   * in pure mode.
   */
  if (
    pure &&
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

    /**
     * Do not computing attribute when in cache
     */
    const cached = getAttribute(state, [moduleId, property]);
    if (cached) {
      return pathAsync(p, cached);
    }

    const data = computeAttribute(moduleId, property, state, stock, pure);
    return pathAsync(p, data);
  }

  if (!pure && value.category === "function/future") {
    const { execute } = futures[value.payload.kind];

    // TODO: pass down arguments
    // TODO: return cached values instead of execution if they exist in the state.
    // TODO: apply loader on a "future" level
    return execute(value.references, {}).then((response) => {
      // TODO: how to invalidate cache at that point?

      return pathAsync(p, response.data);
    });
  }

  if (!pure && value.category === "function/method") {
    const { property } = value.payload;
    const moduleId = value.references.modules.module;

    const atoms = getAtoms(state, moduleId);
    const moduleType = getModuleType(state, moduleId);
    const {
      call,
      settings = [],
      attributes = [],
    } = stock[moduleType].methods[property];

    const resultSettings = mapAsync(
      (field) => computeSetting(moduleId, field, state, stock, pure),
      settings
    );
    const resultAttributes = mapAsync(
      (key) => computeAttribute(moduleId, key, state, stock, pure),
      attributes
    );

    return all([resultSettings, resultAttributes], (settings, attributes) => {
      return call(null, { batch: null, atoms, settings, attributes });
    });
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
export function computeAttribute(moduleId, key, state, stock, pure) {
  const moduleType = getModuleType(state, moduleId);
  const {
    selector,
    settings = [],
    atoms = [],
  } = stock[moduleType].attributes[key];

  const resultSettings = mapAsync((field) => {
    const cached = getSetting(state, [moduleId, field]);
    const isStale = isSettingStale(state, [moduleId, field]);

    if (cached && !isStale) {
      return cached;
    }

    // TODO: most likely should update cache to not repeat computation
    return computeSetting(moduleId, field, state, stock, pure);
  }, settings);

  const resultAtoms = atoms?.map((key) => getAtom(state, [moduleId, key]));

  // TODO: provide "attributes" as well, so attribute can depend on other
  // attributes values
  return then(resultSettings, (resultSettings) =>
    selector({ settings: resultSettings, atoms: resultAtoms })
  );
}
