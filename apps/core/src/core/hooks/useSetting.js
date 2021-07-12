import { useContext } from "react";
import { moduleContext, storeContext } from "../providers";
import useSuspenseSubscription from "./useSuspenseSubscription";

/**
 * Returns setting data of a specific field. Needs to be used inside
 * of a module definition React component.
 *
 * @param {string} field requesting setting field.
 * @returns {unknown} computed data or data from config.
 */
export default function useSetting(field) {
  const store = useContext(storeContext);
  const moduleId = useContext(moduleContext);

  /**
   * Making sure we use the hook only inside of a module.
   */
  if (moduleId === null) {
    throw new Error("useSetting hook should be called inside of a module");
  }

  return useSuspenseSubscription(store.data.setting(moduleId, field));
}
