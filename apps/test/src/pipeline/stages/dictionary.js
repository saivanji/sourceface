import { keys, values, zipObj } from "ramda";
import { Break } from "../execution";
import { evaluate } from "../value";
import { maybePromise } from "../../utils";

export const execute = (input, getScopeVariable) => {
  const breakage = new Break("One of the values of dictionary was broken");
  let broken = false;

  const handleBreak = (err) => {
    if (err instanceof Break) {
      broken = true;
      return;
    }

    throw err;
  };

  const evaluated = values(input).map((value) => {
    try {
      const result = evaluate(value, getScopeVariable);

      /**
       * Catching Break errors when evaluate returns a Promise.
       */
      return result.catch?.(handleBreak) || result;
    } catch (err) {
      /**
       * Catching Break errors when evaluate returns plain value.
       */
      return handleBreak(err);
    }
  });

  /**
   * Returning break in case of sync execution.
   */
  if (broken) {
    return breakage;
  }

  const names = keys(input);

  return maybePromise(evaluated, (data) => {
    /**
     * Returning break in case of async execution
     */
    if (broken) {
      return breakage;
    }

    return zipObj(names, data);
  });
};