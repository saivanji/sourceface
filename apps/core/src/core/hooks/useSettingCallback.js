import { useContext, useCallback } from "react";
import { moduleContext } from "../providers";

/**
 * Returns callback function which will resolve required setting field
 * when called.  Needs to be used inside of a module definition React component.
 *
 * @param {string} field requesting setting field.
 * @returns {function} callback function for the setting resolution.
 */
export default function useSettingCallback(_field) {
  // const store = useContext(storeContext);
  const moduleId = useContext(moduleContext);

  /**
   * Making sure we use the hook only inside of a module.
   */
  if (moduleId === null) {
    throw new Error(
      "useSettingCallback hook should be called inside of a module"
    );
  }

  const callback = useCallback((_input) => {
    console.log("TODO");
  }, []);

  return callback;
}
