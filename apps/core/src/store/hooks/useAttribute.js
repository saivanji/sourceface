import { useContext } from "react";
import { useStore, useSelector } from "react-redux";
import { moduleContext, stockContext } from "../providers";
import {
  eitherOneSettingStale,
  getModuleType,
  getAttribute,
} from "../selectors";
import { computeAttribute } from "../utils";

const emtpyList = [];

/**
 * Returns computed module attribute data.
 *
 * @param {string} key variable key.
 * @returns {unknown} variable data.
 */
export default function useAttribute(key) {
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

  const type = useSelector((state) => getModuleType(state, moduleId));

  const { settings = emtpyList } = stock[type].attributes[key];
  const isStale = useSelector((state) =>
    eitherOneSettingStale(state, [moduleId, settings])
  );
  const data = useSelector((state) => getAttribute(state, [moduleId, key]));

  if (typeof data === "undefined" || isStale) {
    const state = store.getState();
    const result = computeAttribute(moduleId, key, {
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
