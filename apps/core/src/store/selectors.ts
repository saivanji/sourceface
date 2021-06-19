// import { createSelector } from "reselect";
import { isNil } from "ramda";
import type { Module } from "../types";
import type { State } from "./reducers";

// TODO: Keep business logic out of selectors file

export const getModuleIds = (state: State) => state.moduleIds;
export const getModule = (state: State, moduleId: Module["id"]) =>
  state.entities.modules[moduleId];

export const getSettingData = <T>(
  state: State,
  [moduleId, field]: [Module["id"], string]
) => {
  const module = getModule(state, moduleId);
  const stages = state.indexes.stages[moduleId][field];

  /**
   * No stages for that field, using config value.
   */
  if (isNil(stages) || stages.length === 0) {
    return module.config[field] as T;
  }

  return state.computations[moduleId]?.[field] as T;
};
