import { mapObjIndexed } from "ramda";
import { createAtomDependencies } from "./utils";
import * as rawStock from "./stock";

export const stock = mapObjIndexed(
  (value, type) => ({
    ...value,
    type,
    atomDependencies:
      value.attributes && createAtomDependencies(value.attributes),
  }),
  rawStock
);
