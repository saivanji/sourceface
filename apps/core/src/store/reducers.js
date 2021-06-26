import produce from "immer";
import { toPairs } from "ramda";
import { combineReducers } from "@reduxjs/toolkit";
import * as slices from "./slices";
import { computeStages, set } from "./utils";
import { ImpureComputation } from "./exceptions";

const initialState = {};

export const createRootReducer = (stock, spec) => {
  const reducer = combineReducers(spec);
  const dependenciesReducer = createDependeciesReducer(stock);

  return function (state = initialState, action) {
    const nextState = reducer(state, action);

    if (action.type === slices.atoms.actions.update.type) {
      return dependenciesReducer(nextState, action);
    }

    return nextState;
  };
};

/**
 * Reducer, responsible for populating settings data and marking async
 * settings as stale in response to module atom change.
 */
const createDependeciesReducer = (stock) =>
  produce((state, action) => {
    const settingsState = state.settings;
    const staleState = state.stale;

    const { dependencies } = action.payload;

    /**
     * When module atom is updated, traversing over that atom dependent modules
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

          set(settingsState, [moduleId, field], data);
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
