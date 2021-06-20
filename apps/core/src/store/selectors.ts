// import { createSelector } from "reselect";
import { isNil } from "ramda";
import type { Module } from "../types";
import type { State } from "./reducers";

// TODO: Keep business logic out of selectors file

export const getModuleIds = (state: State) => state.moduleIds;
export const getModule = (state: State, moduleId: Module["id"]) =>
  state.entities.modules[moduleId];
export const getFieldStageIds = (
  state: State,
  [moduleId, field]: [Module["id"], string]
) => state.indexes.stages[moduleId][field];

export const getSettingData = <T>(
  state: State,
  [moduleId, field]: [Module["id"], string]
) => {
  const module = getModule(state, moduleId);
  const stages = getFieldStageIds(state, [moduleId, field]);

  /**
   * No stages for that field, using config value.
   */
  if (isNil(stages) || stages.length === 0) {
    return module.config[field] as T;
  }

  return state.computations[moduleId]?.[field] as T;

  // TODO: in case nothing got from computations, start async field computation, throw that Promise
  // and dispatch to Redux store.
  //
  // Try creating custom middleware(which takes dispatched Promise and updates state accordingly
  // after it resolves) instead of redux-saga first
};
