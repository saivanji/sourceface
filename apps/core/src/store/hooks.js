import { useContext, useCallback } from "react";
import { useStore, useDispatch, useSelector } from "react-redux";
import { moduleContext, stockContext } from "./providers";
import * as slices from "./slices";
import {
  getSettingData,
  getModule,
  getAtom,
  getAtomDependencies,
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

  // TODO: make sure the requesting field is a Future
  if (typeof data === "undefined") {
    const state = store.getState();
    const result = computeStages(moduleId, field, state, stock);

    if (result instanceof Promise) {
      throw result.then((data) => {
        store.dispatch(
          slices.settings.actions.populate({
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
 * Returns computed module attribute data.
 *
 * @param {string} key variable key.
 * @returns {unknown} variable data.
 */
export function useAttribute(key) {
  // TODO: have attributes cached in state?
  // TODO: have stale based on attribute definition and it's setting staleness?
  const stock = useContext(stockContext);
  const moduleId = useContext(moduleContext);
  const module = useSelector((state) => getModule(state, moduleId));

  const definition = stock[module.type].variables[key];
  // TODO: embed staleness in "data" selector
  const isStale = null; // use memoized selector to compute staleness based on dependent settings?
}

/**
 * Returns a function used for updating multiple atom values
 * in a single tick.
 *
 * @returns {function} function for updating multiple atom values.
 */
export function useUpdateAtoms() {
  const moduleId = useContext(moduleContext);
  const dispatch = useDispatch();

  /**
   * Making sure we use the hook only inside of a module.
   */
  if (moduleId === null) {
    throw new Error("useUpdateAtoms hook should be called inside of a module");
  }

  const callback = useCallback(
    (fragment) => {
      dispatch(slices.atoms.actions.updateMany({ moduleId, fragment }));
    },
    [moduleId, dispatch]
  );

  return callback;
}

/**
 * Returns module atom value for a given key. To be used in module definitions.
 * @param {string} key module atom field.
 * @returns {[unknown, function]} tuple with a value of a module atom field and a
 * function used for updating it.
 */
export function useAtom(key) {
  const moduleId = useContext(moduleContext);
  const store = useStore();

  /**
   * Making sure we use the hook only inside of a module.
   */
  if (moduleId === null) {
    throw new Error("useAtom hook should be called inside of a module");
  }

  const value = useSelector((state) => getAtom(state, [moduleId, key]));

  const update = useCallback(
    (nextValue) => {
      const state = store.getState();
      const dependencies = getAtomDependencies(state, [moduleId, key]);

      store.dispatch(
        slices.atoms.actions.update({
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
