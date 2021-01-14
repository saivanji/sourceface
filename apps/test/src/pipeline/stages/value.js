import { evaluate } from "../value";

export const execute = (input, getLocal) => evaluate(input.root, getLocal);
