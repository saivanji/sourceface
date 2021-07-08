import { of, BehaviorSubject } from "rxjs";
import setWith from "lodash.setwith";
import { keys } from "ramda";

export default class FakeRegistry {
  constructor() {
    this.registry = {
      entities: {
        modules: {},
        stages: {},
        values: {},
      },
      atoms: {},
    };
  }

  contents() {
    return this.registry;
  }

  /**
   * Returns next id for a desired entities.
   */
  getNextId(entitiesKey) {
    const ids = keys(this.registry.entities[entitiesKey]);

    if (ids.length === 0) {
      return 1;
    }

    return Math.max(...ids);
  }

  /**
   * Adds new entity to the registry.
   */
  addEntity(key, data) {
    const entityId = this.getNextId(key);

    this.registry.entities[key][entityId] = of(data);

    return {
      id: entityId,
      ...data,
    };
  }

  /**
   * Adds new value to the registry.
   */
  addValue(category, payload, { references, path } = {}) {
    return this.addEntity("values", {
      category,
      payload,
      references,
      path,
    });
  }

  /**
   * Adds new module to the registry
   */
  addModule(type, { config, fields } = {}) {
    return this.addEntity("modules", {
      position: 0,
      type,
      config,
      fields,
    });
  }

  /**
   * Adds new stage to the registry
   */
  addStage(moduleId, type) {
    return this.addEntity("stages", {
      order: 0,
      name: "stage_1",
      type,
      values: {
        root: moduleId,
      },
    });
  }

  /**
   * Adds new variable to the registry.
   */
  addVariable(type, payload, extras) {
    return this.addValue(`variable/${type}`, payload, extras);
  }

  /**
   * Adds new function to the registry.
   */
  addFunction(type, payload, extras) {
    return this.addValue(`function/${type}`, payload, extras);
  }

  /**
   * Adds new constant variable to the registry.
   */
  addConstantVariable(value, extras) {
    return this.addVariable("constant", { value }, extras);
  }

  /**
   * Adds new attribute variable to the registry.
   */
  addAttributeVariable(moduleId, property, extras) {
    return this.addVariable(
      "attribute",
      { property },
      {
        references: { modules: { module: moduleId } },
        ...extras,
      }
    );
  }

  /**
   * Adds new future function to the registry.
   */
  addFutureFunction(kind, extras) {
    return this.addFunction("future", { kind }, extras);
  }

  /**
   * Adds new operation future function to the registry.
   */
  addOperationFutureFunction() {
    // TODO: create actual operation here and use it's id instead of "1"
    return this.addFutureFunction("operation", {
      references: { operations: { root: 1 } },
    });
  }

  /**
   * Adds new atom value for the specific module.
   */
  addAtom(moduleId, key, value) {
    set(this.registry, ["atoms", moduleId, key], new BehaviorSubject(value));
  }
}

const set = (...args) => setWith(...args, Object);
