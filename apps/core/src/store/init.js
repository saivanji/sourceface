import { keys } from "ramda";
import {
  configureStore,
  combineReducers,
  getDefaultMiddleware,
} from "@reduxjs/toolkit";
import { pureComputeSettings, populateModulesState } from "./utils";
import * as rootSlices from "./slices";
import * as modulesSlices from "./slices/modules";
import * as computationsSlices from "./slices/computations";
import { createRootReducer } from "./reducers";

// TODO: implement counter module(with state) without async operation(for now)
// TODO: learn more about Suspense and how to handle suspending in
// useSettings hook
// TODO: implement displaying subsequent loading state

export default function init(entities, stock) {
  const defaultMiddleware = getDefaultMiddleware({
    immutableCheck: true,
    serializableCheck: true,
    thunk: false,
  });

  const moduleIds = keys(entities.modules);
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
    // TODO: rename to "settings"?
    computations: {
      data: {},
      stale: {},
    },
    // Mock
    dependencies: {
      813: {
        value: [{ moduleId: 109, fields: ["content"] }],
      },
    },
  };

  const computationsData = pureComputeSettings(preloadedState, stock);

  return configureStore({
    reducer: createRootReducer(stock, {
      entities: rootSlices.entities.reducer,
      modules: combineReducers({
        ids: modulesSlices.ids.reducer,
        state: modulesSlices.state.reducer,
      }),
      computations: combineReducers({
        data: computationsSlices.data.reducer,
        stale: computationsSlices.stale.reducer,
      }),
      dependencies: rootSlices.dependencies.reducer,
    }),
    preloadedState: {
      ...preloadedState,
      computations: {
        ...preloadedState.computations,
        data: computationsData,
      },
    },
    middleware: defaultMiddleware,
    devTools: true,
  });
}
