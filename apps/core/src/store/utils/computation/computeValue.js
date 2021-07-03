import * as futures from "../../futures";
import * as slices from "../../slices";
import { getValue, getModuleType, getAtoms } from "../../selectors";
import { ImpureComputation } from "../../exceptions";
import { mapObjectAsync, pathAsync, mapAsync, pipe, all } from "../common";
import { makeAtomsDependencies } from "../dependencies";
import computeAttribute from "./computeAttribute";
import computeSetting from "./computeSetting";

/**
 * Computes value data.
 */
export default function computeValue(valueId, { deps, opts, scope }) {
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
