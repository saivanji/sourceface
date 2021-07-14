import { useContext, useCallback } from "react";
import { moduleContext, storeContext } from "../providers";

/**
 * Returns callback function which will call required method when called.
 * Needs to be used inside of a module definition React component.
 *
 * @param {string} prop requesting module method.
 * @returns {function} callback function for the method resolution.
 */
export default function useMethod(prop) {
  const store = useContext(storeContext);
  const moduleId = useContext(moduleContext);

  /**
   * Making sure we use the hook only inside of a module.
   */
  if (moduleId === null) {
    throw new Error("useMethod hook should be called inside of a module");
  }

  const callback = useCallback(
    (args) =>
      new Promise((resolve) => {
        const func = store.data.method(moduleId, prop);

        func(args).subscribe(resolve);
      }),
    [moduleId, prop, store]
  );

  return callback;
}
