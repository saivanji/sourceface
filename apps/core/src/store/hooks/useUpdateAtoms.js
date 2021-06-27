import { useContext, useCallback } from "react";
import { useDispatch } from "react-redux";
import { moduleContext } from "../providers";
import * as slices from "../slices";

/**
 * Returns a function used for updating multiple atom values
 * in a single tick.
 *
 * @returns {function} function for updating multiple atom values.
 */
export default function useUpdateAtoms() {
  const moduleId = useContext(moduleContext);
  const dispatch = useDispatch();

  /**
   * Making sure we use the hook only inside of a module.
   */
  if (moduleId === null) {
    throw new Error("useUpdateAtoms hook should be called inside of a module");
  }

  const callback = useCallback(
    (fragment) => {
      dispatch(slices.atoms.actions.updateMany({ moduleId, fragment }));
    },
    [moduleId, dispatch]
  );

  return callback;
}
