import { useContext, useCallback } from "react";
import { moduleContext, storeContext } from "../providers";

export default function useUpdateAtoms() {
  const moduleId = useContext(moduleContext);
  const store = useContext(storeContext);

  /**
   * Making sure we use the hook only inside of a module.
   */
  if (moduleId === null) {
    throw new Error("useUpdateAtoms hook should be called inside of a module");
  }

  const set = useCallback(
    (nextValues) => store.actions.updateAtoms(moduleId, nextValues),
    [moduleId, store]
  );

  return set;
}
