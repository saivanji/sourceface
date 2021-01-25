import { values } from "ramda";

export const execute = (evaluate, input) => {
  for (let value of values(input)) {
    console.log(evaluate(value));
  }
};
