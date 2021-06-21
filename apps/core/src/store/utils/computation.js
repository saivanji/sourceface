import { mapObjIndexed, path } from "ramda";
import * as futures from "../futures";
import { mapObj } from "./common";

// TODO: provide state instead of entities, indexes etc
// use selectors for selecting state data

/**
 * Computes settings of all modules groupped by module id and field.
 */
export function computeSettings(stageIndex, valueIndex, entities) {
  return mapObjIndexed(
    (stagesByField) =>
      mapObjIndexed(
        (stageIds) => computeStages(stageIds, valueIndex, entities),
        stagesByField
      ),
    stageIndex
  );
}

/**
 * Compute specific setting for given stage ids.
 */
export function computeStages(stageIds, valueIndex, entities, isAsync = false) {
  /**
   * We're wrapping "computeSingleStage" function because Typescript 4.2
   * do not support calling ReturnType on a function with a generic type arguments.
   */
  const wrapCompute = (stage) =>
    computeSingleStage(stage, valueIndex, entities, isAsync);

  return stageIds.reduce((_, stageId) => {
    const stage = entities.stages[stageId];
    return wrapCompute(stage);
  }, null);
}

/**
 * Computes specific stage data
 */
export function computeSingleStage(stage, valueIndex, entities, isAsync) {
  // TODO: do we need value index, since we don't use it in selectors
  const stageValueIndex = valueIndex[stage.id];

  if (stage.type === "value") {
    const valueId = stageValueIndex["root"];

    return computeValue(entities.values[valueId], isAsync);
  }

  if (stage.type === "dictionary") {
    return mapObj((valueId) => {
      const value = entities.values[valueId];
      return computeValue(value, isAsync);
    }, stageValueIndex);
  }
}

/**
 * Computes value data.
 */
export function computeValue(value, isAsync) {
  const p = value.path || [];

  if (value.category === "variable/constant") {
    const data = value.payload.value;
    return path(p, data);
  }

  if (value.category === "variable/module") {
    const stock = {};
    const state = {};

    const { property } = value.payload;
    const module = state.entities.modules[value.references.module];
    const definition = stock[module.type][property];
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
    state: moduleState.map((key) => state.modulesState[module.id][key]),
  };

  return selector(input);
}
