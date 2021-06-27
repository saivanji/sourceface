import { useContext, useCallback } from "react";
import { useStore, useSelector } from "react-redux";
import { moduleContext } from "../providers";
import * as slices from "../slices";
import { getAtom, getAtomDependencies } from "../selectors";

/**
 * Returns module atom value for a given key. To be used in module definitions.
 * @param {string} key module atom field.
 * @returns {[unknown, function]} tuple with a value of a module atom field and a
 * function used for updating it.
 */
export default function useAtom(key) {
  const moduleId = useContext(moduleContext);
  const store = useStore();

  /**
   * Making sure we use the hook only inside of a module.
   */
  if (moduleId === null) {
    throw new Error("useAtom hook should be called inside of a module");
  }

  const value = useSelector((state) => getAtom(state, [moduleId, key]));

  const update = useCallback(
    (nextValue) => {
      const state = store.getState();
      const dependencies = getAtomDependencies(state, [moduleId, key]);

      store.dispatch(
        slices.atoms.actions.update({
          moduleId,
          key,
          nextValue,
          dependencies,
        })
      );
    },
    [moduleId, key, store]
  );

  return [value, update];
}
