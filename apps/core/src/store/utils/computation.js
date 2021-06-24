import { mapObjIndexed, path, keys } from "ramda";
import * as futures from "../futures";
import {
  getStage,
  getValue,
  getModule,
  getModulesEntities,
  getModuleStateValue,
} from "../selectors";
import { ImpureComputation } from "../exceptions";
import { mapObj } from "./common";

// TODO: do not return empty object if no stage index or computations data created
/**
 * Computes settings of all modules groupped by module id and field.
 */
export function pureComputeSettings(state, stock) {
  return mapObjIndexed(
    (module) =>
      mapObjIndexed((stageIds) => {
        try {
          return computeStages(stageIds, state, stock, true);
        } catch (err) {
          /**
           * We do not expect impured function to be called when we perform
           * computation in pure mode.
           *
           * Returning "undefined" for the impure setting computation so it won't
           * get populated in the state. Therefore that computation will be performed
           * from the component.
           */
          if (err instanceof ImpureComputation) {
            return undefined;
          }

          throw err;
        }
      }, module.fields),
    getModulesEntities(state)
  );
}

/**
 * Compute specific setting for given stage ids.
 */
export function computeStages(stageIds, state, stock, pure = false) {
  return stageIds.reduce((_, stageId) => {
    return computeSingleStage(stageId, state, stock, pure);
  }, null);
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
    return mapObj((valueId) => {
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
      value.category === "function/effect")
  ) {
    throw new ImpureComputation();
  }

  if (value.category === "variable/constant") {
    const data = value.payload.value;
    return path(p, data);
  }

  if (value.category === "variable/module") {
    const { property } = value.payload;
    const moduleId = value.references.modules.module;
    const module = getModule(state, moduleId);
    const definition = stock[module.type].variables[property];
    const data = applyVariableSelector(state, moduleId, definition);

    return path(p, data);
  }

  if (!pure && value.category === "function/future") {
    const { execute } = futures[value.payload.kind];

    // TODO: pass down arguments
    return execute(value.references, {}).then((response) => {
      // TODO: how to invalidate cache at that point?

      return path(p, response.data);
    });
  }

  // function/future, for operations and other async things
  // function/effect - for displaying notifications, making redirects doing other stuff
  // both future and effect are not applicable for the preload computation
  // TODO: should module function type be part of effect?
}

/**
 * Applies variable selector of a specific module.
 */
export function applyVariableSelector(
  state,
  moduleId,
  { selector, state: moduleState = [] }
) {
  const input = {
    state: moduleState.map((key) =>
      getModuleStateValue(state, [moduleId, key])
    ),
  };

  return selector(input);
}
