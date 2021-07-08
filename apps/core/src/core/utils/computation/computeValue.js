import * as futures from "../../futures";
import * as slices from "../../slices";
import { getValue, getModuleType, getAtoms } from "../../selectors";
import { mapObjectAsync, mapAsync, pipe, all } from "../common";
import { makeAtomsDependencies } from "../dependencies";
import computeAttribute from "./computeAttribute";
import computeSetting from "./computeSetting";
import Data from "./data";

/**
 * Computes value data.
 */
export default function computeValue(valueId, { deps, opts, scope }) {
  const state = deps.store.getState();
  const value = getValue(state, valueId);

  if (value.category === "variable/constant") {
    const data = value.payload.value;

    return new Data(data, value.path, { deps, opts });
  }

  if (value.category === "variable/attribute") {
    const { property } = value.payload;
    const moduleId = value.references.modules.module;

    return pipe(
      computeAttribute(moduleId, property, { deps, opts, scope }),
      (data) => data.assignPath(value.path)
    );
  }

  if (value.category === "variable/input") {
    return new Data(scope?.input, value.path, { deps, opts });
  }

  if (value.category === "function/future") {
    return computeFuture(value, { deps, opts, scope });
  }

  if (value.category === "function/method") {
    return computeMethod(value, { deps, opts, scope });
  }

  // function/future, for operations and other async things
  // function/effect - for displaying notifications, making redirects doing other stuff
  // both future and effect are not applicable for the preload computation
  // TODO: should module function type be part of effect?
}

function computeFuture(value, { deps, opts, scope }) {
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

      return new Data(response.data, value.path, { deps, opts });
    });
  });
}

function computeMethod(value, { deps, opts, scope }) {
  const { property } = value.payload;
  const moduleId = value.references.modules.module;
  const { args = {} } = value;
  const state = deps.store.getState();

  const atoms = getAtoms(state, moduleId);
  const moduleType = getModuleType(state, moduleId);
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
        const state = deps.store.getState();
        const dependencies = makeAtomsDependencies(state, moduleId, atoms);

        deps.store.dispatch(
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