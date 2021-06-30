import { useCallback, useContext } from "react";
import { useStore } from "react-redux";
import { moduleContext } from "../providers";
import { getAtoms } from "../selectors";
import * as slices from "../slices";

/**
 * Returns a function for updating multiple atoms at once.
 */
export default function useBatch() {
  const store = useStore();
  const moduleId = useContext(moduleContext);

  /**
   * Could be used in different ways:
   * - "batch({a: 1, b: 2})"
   * - "batch(prevAtoms => ({ ...prevAtoms, b: 2 }))"
   */
  const callback = useCallback(
    (input) => {
      const state = store.getState();
      const atoms = getAtoms(state, moduleId);
      const fragment = typeof input === "function" ? input(atoms) : input;

      store.dispatch(slices.atoms.actions.updateMany({ moduleId, fragment }));
    },
    [store, moduleId]
  );

  return callback;
}
