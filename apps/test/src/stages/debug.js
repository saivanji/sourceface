import { values } from "ramda";

export const execute = async (input, accessors, scope) => {
  for (let name of values(input)) {
    console.log(accessors.evaluate(name, accessors, scope));
  }
};
