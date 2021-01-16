import { evaluate } from "../value";

export const execute = (input, accessors, scope) =>
  evaluate(input.root, accessors, scope);
