import React, { createContext } from "react";
import { createStore } from "redux";
import { normalize } from "normalizr";
import { Provider as ReduxProvider } from "react-redux";
import rootSchema from "./schema";
import rootReducer from "./reducers";
import {
  createStageIndexes,
  createValueIndexes,
  computeSettings,
} from "./utils";
import type { Module } from "../types";
import type { Entities, Result } from "./reducers";

// TODO: resolve types, especially in utils and hooks
// TODO: split utils, refactor utils
// TODO: learn more about Suspense and how to handle suspending in
// useSettings hook

function init(modules: Module[]) {
  /**
   * Normalizes nested modules data in the plain structure to be
   * convenient to work in state.
   */
  const { result: moduleIds, entities } = normalize<never, Entities, Result>(
    modules,
    rootSchema
  );

  const stageIndexes = createStageIndexes(entities);
  const valueIndexes = createValueIndexes(entities);
  const indexes = { stages: stageIndexes, values: valueIndexes };

  const computations = computeSettings(indexes, entities);

  return createStore(rootReducer, {
    moduleIds,
    entities,
    indexes,
    computations,
  });
}

type ProviderProps = {
  modules: Module[];
  children: React.ReactNode;
};

function Provider({ children, modules }: ProviderProps) {
  // TODO: since "core" will be exported as a library, keep in mind behavior of
  // the store creation on parent component re-render.
  const store = init(modules);

  return <ReduxProvider store={store}>{children}</ReduxProvider>;
}

type ModuleProviderProps = {
  children: React.ReactNode;
  moduleId: Module["id"];
};

const moduleContext = createContext<null | Module["id"]>(null);

/**
 * Provider module needs to be wrapped in, so we have access to it's id.
 */
function ModuleProvider({ children, moduleId }: ModuleProviderProps) {
  return (
    <moduleContext.Provider value={moduleId}>{children}</moduleContext.Provider>
  );
}

export { moduleContext, ModuleProvider, Provider };
