import produce from "immer";
import { toPairs } from "ramda";
import { combineReducers } from "@reduxjs/toolkit";
import * as modulesSlices from "./slices/modules";
import { computeStages, set } from "./utils";
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
        try {
          /**
           * Computing stages of a specific setting. Making computation pure
           * by passing "true" as the last argument, since no side-effects
           * can be possible when calculating next state inside of a reducer.
           */
          const data = computeStages(moduleId, field, state, stock, true);

          set(dataState, [moduleId, field], data);
        } catch (err) {
          /**
           * ImpureComputation will be thrown when computing field contains asynchronous
           * job. That is not possible to evaluate while being inside of a reducer.
           *
           * Therefore, marking the computing field as stale, so the corresponding computation
           * will be triggered inside of a React component.
           */
          if (err instanceof ImpureComputation) {
            set(staleState, [moduleId, field], true);

            continue;
          }

          throw err;
        }
      }
    }
  }, initialState);
