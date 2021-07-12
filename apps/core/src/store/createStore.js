import computeSetting from "./computeSetting";
import computeAttribute from "./computeAttribute";
import createRegistry from "./createRegistry";

/**
 * Creates new store based on initial entities data and stock definition.
 */
export default function createStore(entities, stock, futures) {
  const registry = createRegistry(entities, stock);
  const dependencies = { registry, stock, futures };

  return {
    data: {
      setting(moduleId, field) {
        return computeSetting(moduleId, field, dependencies);
      },
      attribute(moduleId, key) {
        return computeAttribute(moduleId, key, dependencies);
      },
      atom(moduleId, key) {
        return registry.atoms[moduleId][key];
      },
      modules() {
        return registry.ids;
      },
      module(moduleId) {
        return registry.entities.modules[moduleId];
      },
    },
    actions: {
      updateAtom(moduleId, key, nextValue) {
        registry.atoms[moduleId][key].next(nextValue);
      },
    },
  };
}
