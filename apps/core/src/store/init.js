import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { normalize } from "normalizr";
import rootSchema from "./schema";
import {
  createStageIndex,
  createValueIndex,
  computeSettings,
  populateModulesState,
} from "./utils";
import {
  computationsSlice,
  entitiesSlice,
  modulesSlice,
  stageIndexSlice,
  modulesStateSlice,
  valueIndexSlice,
} from "./slices";

// TODO: implement counter module(with state) without async operation(for now)
// TODO: learn more about Suspense and how to handle suspending in
// useSettings hook
// TODO: implement displaying subsequent loading state

export default function init(modules, stock) {
  /**
   * Normalizes nested modules data in the plain structure to be
   * convenient to work in state.
   */
  const { result: moduleIds, entities } = normalize(modules, rootSchema);

  const stageIndex = createStageIndex(entities);
  const valueIndex = createValueIndex(entities);

  const computations = computeSettings(stageIndex, valueIndex, entities);
  const modulesState = populateModulesState(moduleIds, stock, entities);

  return configureStore({
    reducer: {
      modules: modulesSlice.reducer,
      entities: entitiesSlice.reducer,
      computations: computationsSlice.reducer,
      indexes: combineReducers({
        stages: stageIndexSlice.reducer,
        values: valueIndexSlice.reducer,
      }),
      modulesState: modulesStateSlice.reducer,
    },
    preloadedState: {
      modules: moduleIds,
      entities,
      computations,
      indexes: {
        stages: stageIndex,
        values: valueIndex,
      },
      modulesState,
    },
    devTools: true,
  });
}
