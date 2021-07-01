import { useContext } from "react";
import { useStore, useSelector } from "react-redux";
import { moduleContext, stockContext } from "../providers";
import { isSettingStale, getSetting } from "../selectors";
import { computeSetting } from "../utils";

/**
 * Returns setting data of a specific field. Needs to be used inside
 * of a module definition React component.
 *
 * @param {string} field requesting setting field.
 * @returns {unknown} computed data or data from config.
 */
export default function useSetting(field) {
  const store = useStore();
  const moduleId = useContext(moduleContext);
  const stock = useContext(stockContext);

  /**
   * Making sure we use the hook only inside of a module.
   */
  if (moduleId === null) {
    throw new Error("useSetting hook should be called inside of a module");
  }

  const data = useSelector((state) => getSetting(state, [moduleId, field]));
  const isStale = useSelector((state) =>
    isSettingStale(state, [moduleId, field])
  );

  // TODO: make sure the requesting field is a Future
  if (typeof data === "undefined" || isStale) {
    const state = store.getState();
    const result = computeSetting(moduleId, field, {
      state,
      stock,
      dispatch: store.dispatch,
    });

    if (result instanceof Promise) {
      throw result;
    }
  }

  return data;
}
