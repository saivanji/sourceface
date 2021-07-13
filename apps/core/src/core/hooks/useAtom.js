import { useContext, useCallback } from "react";
import { moduleContext, storeContext } from "../providers";
import useSubscription from "./useSubscription";

/**
 * Returns module atom value for a given key. To be used in module definitions.
 * @param {string} key module atom field.
 * @returns {[unknown, function]} tuple with a value of a module atom field and a
 * function used for updating it.
 */
export default function useAtom(key) {
  const moduleId = useContext(moduleContext);
  const store = useContext(storeContext);

  /**
   * Making sure we use the hook only inside of a module.
   */
  if (moduleId === null) {
    throw new Error("useAtom hook should be called inside of a module");
  }

  const value = useSubscription(store.data.atom(moduleId, key));

  const setValue = useCallback(
    (nextValue) => store.actions.updateAtom(moduleId, key, nextValue),
    [moduleId, key, store]
  );

  return [value, setValue];
}
