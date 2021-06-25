import produce from "immer";
import { toPairs } from "ramda";
import { combineReducers } from "@reduxjs/toolkit";
import * as modulesSlices from "./slices/modules";
import { computeStages, assocMutable } from "./utils";
import { getFieldStageIds } from "./selectors";
import { ImpureComputation } from "./exceptions";

const initialState = {};

export const createRootReducer = (stock, spec) => {
  const reducer = combineReducers(spec);
  const dependenciesReducer = createDependeciesReducer(stock);

  return function (state = initialState, action) {
    const nextState = reducer(state, action);

    if (action.type === modulesSlices.state.actions.update.type) {
      return dependenciesReducer(nextState, action);
    }

    return nextState;
  };
};

/**
 * Reducer, responsible for populating settings data and marking async
 * settings as stale in response to module state change.
 */
const createDependeciesReducer = (stock) =>
  produce((state, action) => {
    const dataState = state.computations.data;
    const staleState = state.computations.stale;

    const { dependencies } = action.payload;

    /**
     * When module state is updated, traversing over that state dependent modules
     * and their fields to either compute the data or mark them as stale.
     */
    for (let [moduleId, fields] of toPairs(dependencies)) {
      for (let field of fields) {
        const stageIds = getFieldStageIds(state, [moduleId, field]);

        try {
          const data = computeStages(stageIds, state, stock, true);

          assocMutable(dataState, [moduleId, field], data);
        } catch (err) {
          if (err instanceof ImpureComputation) {
            assocMutable(staleState, [moduleId, field], true);

            continue;
          }

          throw err;
        }
      }
    }
  }, initialState);
