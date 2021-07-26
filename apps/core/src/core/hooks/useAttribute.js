import { useContext } from "react";
import { moduleContext, storeContext } from "../providers";
import useAsyncValue from "./useAsyncValue";

/**
 * Returns computed module attribute data.
 *
 * @param {string} key variable key.
 * @returns {unknown} variable data.
 */
export default function useAttribute(key) {
  const store = useContext(storeContext);
  const moduleId = useContext(moduleContext);

  /**
   * Making sure we use the hook only inside of a module.
   */
  if (moduleId === null) {
    throw new Error("useAttribute hook should be called inside of a module");
  }

  return useAsyncValue(store.data.attribute(moduleId, key));
}
