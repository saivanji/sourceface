import { map, keys, isNil } from "ramda";
import { of, BehaviorSubject } from "rxjs";

/**
 * Creates registry of the streams used during the computation
 * process.
 */
export default function createRegistry(entities, stock) {
  return {
    entities: {
      modules: populateEntity(entities.modules),
      stages: populateEntity(entities.stages),
      values: populateEntity(entities.values),
    },
    ids: populateIds(entities.modules),
    atoms: populateAtoms(entities.modules, stock),
    settings: {},
    attributes: {},
  };
}

/**
 * Creates atoms streams based on initial configuration from stock.
 */
function populateAtoms(modules, stock) {
  const moduleIds = keys(modules);

  return moduleIds.reduce((acc, moduleId) => {
    const module = modules[moduleId];
    const { initialAtoms } = stock[module.type];

    if (isNil(initialAtoms)) {
      return acc;
    }

    return {
      ...acc,
      [moduleId]: map(
        (initialValue) => new BehaviorSubject(initialValue),
        initialAtoms
      ),
    };
  }, {});
}

/**
 * Transforms raw entity data to the same shape object of streams.
 */
function populateEntity(items) {
  return map(of, items);
}

/**
 * Creates stream of module ids from modules data.
 */
// TODO: maybe we need to group module ids by parent id if it would be
// convenient to render.
function populateIds(modules) {
  return of(keys(modules));
}
