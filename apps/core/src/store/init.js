import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { normalize } from "normalizr";
import rootSchema from "./schema";
import {
  createStageIndex,
  createValueIndex,
  computeSettings,
  populateModulesState,
} from "./utils";
import * as rootSlices from "./slices";
import * as computationsSlices from "./slices/computations";
import * as indexesSlices from "./slices/indexes";
import * as modulesSlices from "./slices/modules";

// TODO: implement counter module(with state) without async operation(for now)
// TODO: learn more about Suspense and how to handle suspending in
// useSettings hook
// TODO: implement displaying subsequent loading state
// TODO: add flow?

export default function init(modules, stock) {
  /**
   * Normalizes nested modules data in the plain structure to be
   * convenient to work in state.
   */
  const { result: moduleIds, entities } = normalize(modules, rootSchema);

  const stageIndex = createStageIndex(entities);
  const valueIndex = createValueIndex(entities);

  const modulesState = populateModulesState(moduleIds, stock, entities);

  /**
   * Constructing initial state without computation, so we can pass it to
   * the function for creating these computations.
   */
  const preloadedState = {
    entities,
    modules: {
      ids: moduleIds,
      state: modulesState,
    },
    computations: {
      data: {},
      stale: {},
    },
    indexes: {
      stages: stageIndex,
      values: valueIndex,
    },
  };

  const computationsData = computeSettings(preloadedState);

  return configureStore({
    reducer: {
      entities: rootSlices.entities.reducer,
      modules: combineReducers({
        ids: modulesSlices.ids.reducer,
        state: modulesSlices.state.reducer,
      }),
      computations: combineReducers({
        data: computationsSlices.data.reducer,
        stale: computationsSlices.stale.reducer,
      }),
      indexes: combineReducers({
        stages: indexesSlices.stages.reducer,
        values: indexesSlices.values.reducer,
      }),
    },
    preloadedState: {
      ...preloadedState,
      computations: {
        ...preloadedState.computations,
        data: computationsData,
      },
    },
    devTools: true,
  });
}
