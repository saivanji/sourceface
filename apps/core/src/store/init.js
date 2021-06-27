import { keys } from "ramda";
import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { populateSettings, populateAtoms, populateDependencies } from "./utils";
import * as slices from "./slices";
import { createRootReducer } from "./reducers";

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
  const middleware = getDefaultMiddleware({
    immutableCheck: true,
    serializableCheck: true,
    thunk: false,
  });

  const reducer = createRootReducer(stock, {
    entities: slices.entities.reducer,
    // TODO: replace by groupped by parent module index
    ids: slices.ids.reducer,
    atoms: slices.atoms.reducer,
    attributes: slices.attributes.reducer,
    settings: slices.settings.reducer,
    stale: slices.stale.reducer,
    dependencies: slices.dependencies.reducer,
  });

  const moduleIds = keys(entities.modules);
  let preloadedState = reducer({ entities, ids: moduleIds }, {});

  preloadedState.atoms = populateAtoms(stock, preloadedState);
  preloadedState.settings = populateSettings(stock, preloadedState);

  const { dependencies, attributes } = populateDependencies(
    stock,
    preloadedState
  );

  preloadedState.dependencies = dependencies;
  preloadedState.attributes = attributes;

  return configureStore({
    reducer,
    preloadedState,
    middleware,
    devTools: true,
  });
}
