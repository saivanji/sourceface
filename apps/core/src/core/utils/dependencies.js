import { keys, mergeWith, compose, uniq, concat } from "ramda";
import { getAtomDependencies } from "../selectors";

/**
 * Creates object of dependencies for the given multiple module atoms.
 */
export function makeAtomsDependencies(state, moduleId, atoms) {
  const items = keys(atoms).map((key) =>
    getAtomDependencies(state, [moduleId, key])
  );

  return mergeDependencies(...items);
}

/**
 * Merges multiple dependencies state objects into a single object removing duplicates.
 */
export function mergeDependencies(...items) {
  const [head, ...tail] = items;

  if (!head) {
    return;
  }

  const merged = mergeDependencies(...tail);

  if (!merged) {
    return head;
  }

  return mergeWith(compose(uniq, concat), head, merged);
}
