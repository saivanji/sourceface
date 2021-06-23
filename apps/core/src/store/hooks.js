import { useContext, useCallback } from "react";
import { useStore, useSelector } from "react-redux";
import { moduleContext, stockContext } from "./providers";
import * as modulesSlices from "./slices/modules";
import * as computationsSlices from "./slices/computations";
import {
  getSettingData,
  getFieldStageIds,
  getModuleStateValue,
  getModuleStateDependencies,
  isComputationStale,
} from "./selectors";
import { computeStages } from "./utils";

// TODO: might provide "defaultValue" as a second argument
export function useSetting(field) {
  const store = useStore();
  const moduleId = useContext(moduleContext);
  const stock = useContext(stockContext);

  /**
   * Making sure we use the hook only inside of a module.
   */
  if (moduleId === null) {
    throw new Error("useSetting hook should be called inside of a module");
  }

  const data = useSelector((state) => getSettingData(state, [moduleId, field]));
  const isStale = useSelector((state) =>
    isComputationStale(state, [moduleId, field])
  );

  // TODO: make sure the requesting field is a Future
  if (typeof data === "undefined" || isStale) {
    const state = store.getState();
    const stageIds = getFieldStageIds(state, [moduleId, field]);
    const result = computeStages(stageIds, state, stock);

    if (result instanceof Promise) {
      throw result.then((data) => {
        store.dispatch(
          computationsSlices.data.actions.populateSetting({
            moduleId,
            field,
            data,
          })
        );
      });
    }
  }

  return data;
}

/**
 * Returns module state value for a given key. To be used in module definitions.
 */
export function useStateValue(key) {
  const moduleId = useContext(moduleContext);
  const store = useStore();

  const value = useSelector((state) =>
    getModuleStateValue(state, [moduleId, key])
  );

  const update = useCallback(
    (nextValue) => {
      const state = store.getState();
      const dependencies = getModuleStateDependencies(state, [moduleId, key]);

      store.dispatch(
        modulesSlices.state.actions.update({
          moduleId,
          key,
          nextValue,
          dependencies,
        })
      );
    },
    [moduleId, key, store]
  );

  return [value, update];
}
