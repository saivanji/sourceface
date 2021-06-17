// import { createSelector } from "reselect";
import { stock as modulesStock } from "../modules";
import type { Module } from "../types";
import type { State } from "./reducers";

// TODO: Keep business logic out of selectors file

export const getModuleIds = (state: State) => state.moduleIds;
export const getModule = (state: State, moduleId: Module["id"]) =>
  state.entities.modules[moduleId];

export const getSettingData = (
  state: State,
  [moduleId, field]: [Module["id"], string]
) => {
  const module = getModule(state, moduleId);
  const { initialConfig } = modulesStock[module.type];

  /**
   * Filtering out the stages not related to the current field.
   */
  const stages = module.stages.filter((stageId) => {
    const stage = state.entities.stages[stageId];
    return stage.group === `${field}/default`;
  });

  /**
   * No stages for that field, using config value.
   */
  if (stages.length === 0) {
    return {
      isLoading: false,
      data: module.config[field] || initialConfig?.[field],
    };
  }

  // TODO: in the future have only "async" values to be in the computations
  // since sync values can be computed right in the selector
  return state.computations[moduleId][field];
};
