import { keys } from "ramda";
import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { populateSettings, populateAtoms, populateDependencies } from "./utils";
import * as slices from "./slices";
import { createRootReducer } from "./reducers";

// TODO: implement attributes
//
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
// TODO: use ts
// TODO: rename computations to evaluations?

export default function init(entities, stock) {
  const defaultMiddleware = getDefaultMiddleware({
    immutableCheck: true,
    serializableCheck: true,
    thunk: false,
  });

  // TODO: remove in favor of groupped index
  const moduleIds = keys(entities.modules);

  const atoms = populateAtoms(stock, entities);
  const dependencies = populateDependencies(stock, entities);

  /**
   * Constructing initial state without settings, so we can pass it to
   * the function for computing initial settings.
   */
  const preloadedState = {
    entities,
    // TODO: replace by groupped by parent module index
    ids: moduleIds,
    atoms,
    attributes: {},
    settings: {},
    stale: {},
    dependencies,
  };

  const settings = populateSettings(preloadedState, stock);

  return configureStore({
    reducer: createRootReducer(stock, {
      entities: slices.entities.reducer,
      ids: slices.ids.reducer,
      atoms: slices.atoms.reducer,
      attributes: slices.attributes.reducer,
      settings: slices.settings.reducer,
      stale: slices.stale.reducer,
      dependencies: slices.dependencies.reducer,
    }),
    preloadedState: {
      ...preloadedState,
      settings,
    },
    middleware: defaultMiddleware,
    devTools: true,
  });
}
