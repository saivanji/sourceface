// import { createSelector } from "reselect";
import { isNil } from "ramda";
import type { Module, ValueOf } from "../types";
import type { State } from "./init";

// TODO: what if computation will be performed at selectors level, with the help of indexes?

// TODO: Keep business logic out of selectors file

export const getModuleIds = (state: State) => state.modules;
export const getModule = <M extends Module>(
  state: State<M>,
  moduleId: M["id"]
) => state.entities.modules[moduleId];
export const getFieldStageIds = <M extends Module>(
  state: State<M>,
  [moduleId, field]: [M["id"], keyof M["config"]]
) => state.indexes.stages[moduleId][field];

export const getSettingData = <M extends Module>(
  state: State<M>,
  [moduleId, field]: [M["id"], keyof M["config"]]
) => {
  const module = getModule<M>(state, moduleId);
  const stages = getFieldStageIds(state, [moduleId, field]);

  /**
   * No stages for that field, using config value.
   */
  if (isNil(stages) || stages.length === 0) {
    type Config = {
      [k in keyof M["config"]]: ValueOf<M["config"]>;
    };

    return (module.config as Config)[field];

    //     return module.config[field]
  }

  return state.computations[moduleId]?.[field];

  // TODO: in case nothing got from computations, start async field computation, throw that Promise
  // and dispatch to Redux store.
  //
  // Try creating custom middleware(which takes dispatched Promise and updates state accordingly
  // after it resolves) instead of redux-saga first
};
