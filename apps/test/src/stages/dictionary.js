import { mapObjIndexed } from "ramda";
import { Break } from "../store/state";

export const execute = (input, accessors, scope) => {
  try {
    return mapObjIndexed(
      (name) => accessors.evaluate(name, accessors, scope),
      input
    );
  } catch (err) {
    if (err instanceof Break) {
      throw new Break("One of dictionary's values execution was interrupted");
    }

    throw err;
  }
};
