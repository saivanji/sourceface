import { keys } from "ramda";
import {
  configureStore,
  combineReducers,
  getDefaultMiddleware,
} from "@reduxjs/toolkit";
import {
  populateComputations,
  populateModulesState,
  populateDependencies,
} from "./utils";
import * as rootSlices from "./slices";
import * as modulesSlices from "./slices/modules";
import * as computationsSlices from "./slices/computations";
import { createRootReducer } from "./reducers";

// TODO: implement Button component
// TODO: implement Input component
// TODO: implement Container component
// TODO: implement module functions
// TODO: implement @mount field
// TODO: implement wildcard values. form_*.reveal(), form_*.value
// TODO: implement caching operations, invalidating their cache
// How to avoid duplicating cached data in operations and computations?
//
// TODO: integrate grid
// TODO: implement editor, implement separation of settings and computations
//
// TODO: learn more about Suspense and how to handle suspending in
// useSettings hook
// TODO: implement displaying subsequent loading state
// TODO: have index of module ids groupped by parent id
// TODO: google for "data structures" in js to get inspiration on how to better structure
// state

export default function init(entities, stock) {
  const defaultMiddleware = getDefaultMiddleware({
    immutableCheck: true,
    serializableCheck: true,
    thunk: false,
  });

  // TODO: remove in favor of groupped index
  const moduleIds = keys(entities.modules);

  const modulesState = populateModulesState(stock, entities);
  const dependencies = populateDependencies(stock, entities);

  /**
   * Constructing initial state without computation, so we can pass it to
   * the function for creating these computations.
   */
  const preloadedState = {
    entities,
    modules: {
      // TODO: replace by groupped by parent module index
      ids: moduleIds,
      state: modulesState,
    },
    // TODO: rename to "settings"?
    computations: {
      data: {},
      stale: {},
    },
    dependencies,
  };

  const computationsData = populateComputations(preloadedState, stock);

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
