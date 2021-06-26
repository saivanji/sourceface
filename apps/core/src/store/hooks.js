import { useContext, useCallback } from "react";
import { useStore, useSelector } from "react-redux";
import { moduleContext, stockContext } from "./providers";
import * as modulesSlices from "./slices/modules";
import * as computationsSlices from "./slices/computations";
import {
  getSettingData,
  getModuleStateValue,
  getModuleStateDependencies,
  isComputationStale,
} from "./selectors";
import { computeStages } from "./utils";

/**
 * Returns setting data of a specific field. Needs to be used inside
 * of a module definition React component.
 *
 * @param {string} field requesting setting field.
 * @returns {unknown} computed data or data from config.
 */
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
    const result = computeStages(moduleId, field, state, stock);

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
 * Returns callback function which will resolve required setting field
 * when called.  Needs to be used inside of a module definition React component.
 *
 * @param {string} field requesting setting field.
 * @returns {function} callback function for the setting resolution.
 */
export function useSettingCallback(field) {
  const store = useStore();
  const stock = useContext(stockContext);
  const moduleId = useContext(moduleContext);

  /**
   * Making sure we use the hook only inside of a module.
   */
  if (moduleId === null) {
    throw new Error(
      "useSettingCallback hook should be called inside of a module"
    );
  }

  const callback = useCallback(() => {
    const state = store.getState();

    return computeStages(moduleId, field, state, stock);
  }, [store, moduleId, field, stock]);

  return callback;
}

/**
 * Returns module state value for a given key. To be used in module definitions.
 * @param {string} key module state field.
 * @returns {unknown} value of a module state field.
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
