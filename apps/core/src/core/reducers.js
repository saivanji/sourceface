import produce from "immer";
import { toPairs } from "ramda";
import { combineReducers } from "@reduxjs/toolkit";
import * as slices from "./slices";
import { computeSetting, computeAttribute, set } from "./utils";
import { getModuleType } from "./selectors";
import { ImpureComputation } from "./exceptions";

const initialState = {};

export const createRootReducer = (stock, spec) => {
  const reducer = combineReducers(spec);
  // const dependenciesReducer = createDependeciesReducer(stock);

  return function (state = initialState, action) {
    const nextState = reducer(state, action);

    // if (
    //   action.type === slices.atoms.actions.update.type ||
    //   action.type === slices.atoms.actions.updateMany.type
    // ) {
    //   return dependenciesReducer(nextState, action);
    // }

    return nextState;
  };
};

// TODO: compute in a separate thread
/**
 * Reducer, responsible for populating settings data and marking async
 * settings as stale in response to module atom change.
 */
export const createDependeciesReducer = (stock) =>
  produce((state, action) => {
    const settingsState = state.settings;
    const staleState = state.stale;

    const { dependencies } = action.payload;

    /**
     * Recomputing attributes dependent on the updating atom.
     */
    if (action.type === slices.atoms.actions.update.type) {
      const { moduleId, key } = action.payload;

      processSelfAttributes(moduleId, key, state, stock);
    }

    /**
     * Recomputing attributes dependent on the updating multiple atoms.
     */
    if (action.type === slices.atoms.actions.updateMany.type) {
      const { moduleId, fragment } = action.payload;

      for (let atomKey in fragment) {
        processSelfAttributes(moduleId, atomKey, state, stock);
      }
    }

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
          const data = computeSetting(moduleId, field, {
            deps: { state, stock },
            opts: {
              pure: true,
              forceComputation: true,
            },
          });

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

/**
 * Recomputes attributes depending on the updating atom.
 */
function processSelfAttributes(moduleId, atomKey, draftState, stock) {
  const attributesState = draftState.attributes;
  const moduleType = getModuleType(draftState, moduleId);
  const attributeKeys = stock[moduleType].atomDependencies?.[atomKey];

  /**
   * Doing nothing when no dependent attributes where found for the
   * current atom.
   */
  if (!attributeKeys) {
    return;
  }

  for (let key of attributeKeys) {
    try {
      const data = computeAttribute(moduleId, key, {
        deps: { state: draftState, stock },
        opts: {
          pure: true,
          forceComputation: true,
        },
      });

      set(attributesState, [moduleId, key], data);
    } catch (err) {
      /**
       * Ignoring impure computations, since in that case, attributes dependent
       * on stale settings will be recomputed in the component.
       */
      if (err instanceof ImpureComputation) {
        continue;
      }

      throw err;
    }
  }
}
