import { createStore } from "redux";
import { normalize } from "normalizr";
import rootSchema from "./schema";
import rootReducer from "./reducers";
import {
  createStageIndexes,
  createValueIndexes,
  computeSettings,
} from "./utils";
import type { Module } from "../types";
import type { Entities, Result } from "./reducers";

// TODO: learn more about Suspense and how to handle suspending in
// useSettings hook
// TODO: implement displaying subsequent loading state

export default function init(modules: Module[]) {
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

  const computations = computeSettings<unknown>(indexes, entities);

  return createStore(rootReducer, {
    moduleIds,
    entities,
    indexes,
    computations,
  });
}
