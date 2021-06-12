import { values } from "ramda";

export const execute = (evaluate, input) => {
  for (let value of values(input)) {
    const result = evaluate(value);

    if (result instanceof Promise) {
      result.then(console.log);
      continue;
    }

    console.log(result);
  }
};
