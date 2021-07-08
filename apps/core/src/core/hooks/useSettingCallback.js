import { useContext, useCallback } from "react";
import { useStore } from "react-redux";
import { moduleContext, stockContext } from "../providers";
import { computeSetting } from "../utils";

/**
 * Returns callback function which will resolve required setting field
 * when called.  Needs to be used inside of a module definition React component.
 *
 * @param {string} field requesting setting field.
 * @returns {function} callback function for the setting resolution.
 */
export default function useSettingCallback(field) {
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

  const callback = useCallback(
    (input) => {
      const state = store.getState();

      return computeSetting(moduleId, field, {
        deps: {
          state,
          stock,
          dispatch: store.dispatch,
        },
        scope: { input },
      });
    },
    [store, moduleId, field, stock]
  );

  return callback;
}
