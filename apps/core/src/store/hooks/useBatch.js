import { keys, pick } from "ramda";
import { useDispatch } from "react-redux";

/**
 * Combines multiple setters(dispatchers of redux actions) into a single action dispatch.
 * Supplied setter should return desired action type and it's key with previous value.
 * Setters will be provided with 2nd argument equal to "true" so their implementation
 * could distinguish regular calls from batch invocations.
 *
 * @param {function[]} ...setters list of setter functions need to be batched.
 */
export default function useBatch(...setters) {
  const dispatch = useDispatch();

  /**
   * Could be used in different ways:
   * - "batch({a: 1, b: 2})"
   * - "batch(prevAtoms => ({ ...prevAtoms, b: 2 }))"
   */
  return (next) => {
    const { actionType, prev } = setters.reduce((acc, setter) => {
      const { actionType, key, value } = setter(undefined, true);

      return {
        actionType,
        prev: {
          ...acc?.prev,
          [key]: value,
        },
      };
    }, null);

    const whitelist = keys(prev);
    const payload = typeof next === "function" ? next(prev) : next;

    return dispatch({
      type: actionType,
      payload: pick(whitelist, payload),
    });
  };
}
