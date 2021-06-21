import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { normalize } from "normalizr";
import rootSchema, { NormalizedModule } from "./schema";
import { createStageIndex, createValueIndex, computeSettings } from "./utils";
import {
  computationsSlice,
  entitiesSlice,
  modulesSlice,
  stageIndexSlice,
  valueIndexSlice,
} from "./slices";
import type { Module } from "../types";
import type {
  EntitiesState,
  ModulesState,
  ComputationsState,
  StageIndexState,
  ValueIndexState,
} from "./slices";

// TODO: implement counter module(with state) without async operation(for now)
// TODO: learn more about Suspense and how to handle suspending in
// useSettings hook
// TODO: implement displaying subsequent loading state

export default function init(modules: Module[]) {
  /**
   * Normalizes nested modules data in the plain structure to be
   * convenient to work in state.
   */
  const { result: moduleIds, entities } = normalize<
    never,
    EntitiesState,
    ModulesState
  >(modules, rootSchema);

  const stageIndex = createStageIndex(entities);
  const valueIndex = createValueIndex(entities);

  const computations = computeSettings<unknown>(
    stageIndex,
    valueIndex,
    entities
  );

  return configureStore({
    reducer: {
      modules: modulesSlice.reducer,
      entities: entitiesSlice.reducer,
      computations: computationsSlice.reducer,
      indexes: combineReducers({
        stages: stageIndexSlice.reducer,
        values: valueIndexSlice.reducer,
      }),
    },
    preloadedState: {
      modules: moduleIds,
      entities,
      computations,
      indexes: {
        stages: stageIndex,
        values: valueIndex,
      },
    },
  });
}

export type State<M extends NormalizedModule = NormalizedModule> = {
  modules: Module["id"][];
  entities: EntitiesState<M>;
  computations: ComputationsState<M>;
  indexes: {
    stages: StageIndexState;
    values: ValueIndexState;
  };
};
