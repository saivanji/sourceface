import { mapObjIndexed, path } from "ramda";
import * as futures from "../futures";
import {
  getStageValueIndex,
  getStageIndex,
  getStage,
  getValue,
  getModule,
  getModuleStateValue,
} from "../selectors";
import { mapObj } from "./common";

// TODO: do not return empty object if no stage index or computations data created
/**
 * Computes settings of all modules groupped by module id and field.
 */
export function computeSettings(state, stock) {
  return mapObjIndexed(
    (stagesByField) =>
      mapObjIndexed(
        (stageIds) => computeStages(stageIds, state, stock),
        stagesByField
      ),
    getStageIndex(state)
  );
}

/**
 * Compute specific setting for given stage ids.
 */
export function computeStages(stageIds, state, stock, isAsync = false) {
  return stageIds.reduce((_, stageId) => {
    return computeSingleStage(stageId, state, stock, isAsync);
  }, null);
}

/**
 * Computes specific stage data
 */
export function computeSingleStage(stageId, state, stock, isAsync) {
  const stage = getStage(state, stageId);
  // TODO: do we need value index, since we don't use it in selectors
  const stageValueIndex = getStageValueIndex(state, stage.id);

  if (stage.type === "value") {
    const valueId = stageValueIndex["root"];
    return computeValue(valueId, state, stock, isAsync);
  }

  if (stage.type === "dictionary") {
    return mapObj((valueId) => {
      return computeValue(valueId, state, stock, isAsync);
    }, stageValueIndex);
  }
}

/**
 * Computes value data.
 */
export function computeValue(valueId, state, stock, isAsync) {
  const value = getValue(state, valueId);
  const p = value.path || [];

  if (value.category === "variable/constant") {
    const data = value.payload.value;
    return path(p, data);
  }

  if (value.category === "variable/module") {
    const { property } = value.payload;
    const module = getModule(state, value.references.modules.module);
    const definition = stock[module.type].variables[property];
    const data = applyVariableSelector(state, module, definition);

    return path(p, data);
  }

  if (isAsync && value.category === "function/future") {
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
  module,
  { selector, state: moduleState = [] }
) {
  const input = {
    state: moduleState.map((key) =>
      getModuleStateValue(state, [module.id, key])
    ),
  };

  return selector(input);
}
