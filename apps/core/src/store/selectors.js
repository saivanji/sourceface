import { isNil } from "ramda";

// TODO: what if computation will be performed at selectors level, with the help of indexes?

// TODO: Keep business logic out of selectors file

/**
 * Returns all module ids of the page.
 */
export const getModuleIds = (state) => state.modules.ids;

/**
 * Returns module by it's id.
 */
export const getModule = (state, moduleId) => state.entities.modules[moduleId];

/**
 * Returns stage by it's id
 */
export const getStage = (state, stageId) => state.entities.stages[stageId];

/**
 * Returns value by it's id
 */
export const getValue = (state, valueId) => state.entities.values[valueId];

/**
 * Returns calculated setting data for the specific module field.
 */
export const getSettingData = (state, [moduleId, field]) => {
  const module = getModule(state, moduleId);
  const stages = getFieldStageIds(state, [moduleId, field]);

  /**
   * No stages for that field, using config value.
   */
  if (isNil(stages) || stages.length === 0) {
    return module.config[field];
  }

  return state.computations.data[moduleId]?.[field];

  // TODO: in case nothing got from computations, start async field computation, throw that Promise
  // and dispatch to Redux store.
  //
  // Try creating custom middleware(which takes dispatched Promise and updates state accordingly
  // after it resolves) instead of redux-saga first
};

export const isComputationStale = (state, [moduleId, field]) => {
  return Boolean(state.computations.stale[moduleId]?.[field]);
};

/**
 * Returns stage ids of a module from the index.
 */
export const getFieldStageIds = (state, [moduleId, field]) =>
  state.indexes.stages[moduleId][field];

/**
 * Returns index of stages groupped by module id and field.
 */
export const getStageIndex = (state) => state.indexes.stages;

/**
 * Returns index of stage values groupped by value name.
 */
export const getStageValueIndex = (state, stageId) =>
  state.indexes.values[stageId];

/**
 * Returns module state value for the key.
 */
export const getModuleStateValue = (state, [moduleId, key]) =>
  state.modules.state[moduleId]?.[key];

/**
 * Returns the modules list, which depend on the module state field.
 */
export const getModuleStateDependencies = (state, [moduleId, key]) =>
  state.indexes.dependencies[moduleId][key];
