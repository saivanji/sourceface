import { useContext, useCallback } from "react";
import { moduleContext, storeContext } from "../providers";
import { Interruption } from "../../store";

/**
 * Returns callback function which will resolve required setting field
 * when called.  Needs to be used inside of a module definition React component.
 *
 * @param {string} field requesting setting field.
 * @returns {function} callback function for the setting resolution.
 */
export default function useSettingCallback(field) {
  const store = useContext(storeContext);
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
    (input) =>
      // TODO: how not to return Promise if computation is sync?
      new Promise((resolve) => {
        store.actions
          .setting(moduleId, field, { input })
          .subscribe(resolve, (err) => {
            /**
             * Ignoring interruptions, since the errors are displayed in the UI
             * by the module definition.
             */
            if (!(err instanceof Interruption)) {
              throw err;
            }
          });
        // TODO: use unsubscribe
      }),
    [moduleId, field, store]
  );

  return callback;
}
