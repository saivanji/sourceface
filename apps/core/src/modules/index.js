import { mapObjIndexed } from "ramda";

import * as button from "./button";
import * as counter from "./counter";
import * as input from "./input";
import * as text from "./text";

export const stock = mapObjIndexed(
  (value, type) => ({
    ...value,
    type,
    atomDependencies:
      value.attributes && createAtomDependencies(value.attributes),
  }),
  {
    button,
    counter,
    input,
    text,
  }
);

/**
 * Creates an object where keys are atom fields and values are lists
 * of attributes those atoms depend.
 */
function createAtomDependencies(attributes) {
  let result;

  for (let attributeKey in attributes) {
    const { atoms } = attributes[attributeKey];

    if (!atoms) {
      continue;
    }

    result = result || {};

    for (let atomKey of atoms) {
      result[atomKey] = result[atomKey] || [];

      const deps = result[atomKey];

      if (!deps.includes(attributeKey)) {
        deps.push(attributeKey);
      }
    }
  }

  return result;
}
