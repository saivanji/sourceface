import { mapObjIndexed } from "ramda";
import { Break } from "../store/state";

export const execute = (evaluate, input) => {
  try {
    return mapObjIndexed((value) => evaluate(value), input);
  } catch (err) {
    if (err instanceof Break) {
      throw new Break("One of dictionary's values execution was interrupted");
    }

    throw err;
  }
};
