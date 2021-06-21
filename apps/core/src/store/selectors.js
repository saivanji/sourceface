import { isNil } from "ramda";

// TODO: what if computation will be performed at selectors level, with the help of indexes?

// TODO: Keep business logic out of selectors file

/**
 * Returns all module ids of the page.
 */
export const getModuleIds = (state) => state.modules;

/**
 * Returns module by it's id.
 */
export const getModule = (state, moduleId) => state.entities.modules[moduleId];

/**
 * Returns stage ids of a module from the index.
 */
export const getFieldStageIds = (state, [moduleId, field]) =>
  state.indexes.stages[moduleId][field];

/**
 * Returns module state value for the key.
 */
export const getModuleStateValue = (state, [moduleId, key]) =>
  state.modulesState[moduleId]?.[key];

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

  return state.computations[moduleId]?.[field];

  // TODO: in case nothing got from computations, start async field computation, throw that Promise
  // and dispatch to Redux store.
  //
  // Try creating custom middleware(which takes dispatched Promise and updates state accordingly
  // after it resolves) instead of redux-saga first
};
