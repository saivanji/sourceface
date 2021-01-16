import { evaluate } from "../value";

export const execute = (input, accessors) => evaluate(input.root, accessors);
