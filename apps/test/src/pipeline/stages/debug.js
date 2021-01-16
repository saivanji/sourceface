import { values } from "ramda";
import { evaluate } from "../value";
import { maybePromise } from "../../utils";

export const execute = async (input, accessors, scope) => {
  const results = values(input).map((value) =>
    evaluate(value, accessors, scope)
  );

  return maybePromise(results, (results) => {
    for (let result of results) {
      console.log(result);
    }
  });
};
