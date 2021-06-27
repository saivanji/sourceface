import produce from "immer";
import { keys } from "ramda";

export default class FakeState {
  constructor() {
    this.state = {
      entities: {
        modules: {},
        stages: {},
        values: {},
      },
      ids: [],
      atoms: {},
      attributes: {},
      settings: {},
      stale: {},
      dependencies: {},
    };
  }

  contents() {
    return this.state;
  }

  updateState(fn) {
    this.state = produce(this.state, fn);
  }

  /**
   * Returns next id for a desired entities.
   */
  getNextId(entitiesKey) {
    const ids = keys(this.state.entities[entitiesKey]);

    if (ids.length === 0) {
      return 1;
    }

    return Math.max(...ids);
  }

  /**
   * Adds new entity to the state.
   */
  addEntity(key, data) {
    const entityId = this.getNextId(key);

    this.updateState((state) => {
      state.entities[key][entityId] = data;
    });

    return [entityId, data];
  }

  /**
   * Adds new value to the state.
   */
  addValue(category, payload, references) {
    return this.addEntity("values", {
      category,
      payload,
      references,
    });
  }

  /**
   * Adds new module to the state
   */
  addModule(type, config) {
    return this.addEntity("modules", {
      position: 0,
      type,
      config,
    });
  }

  /**
   * Adds new variable to the state.
   */
  addVariable(type, payload, references) {
    return this.addValue(`variable/${type}`, payload, references);
  }

  /**
   * Adds new function to the state.
   */
  addFunction(type, payload, references) {
    return this.addValue(`function/${type}`, payload, references);
  }

  /**
   * Adds new constant variable to the state.
   */
  addConstantVariable(value) {
    return this.addVariable("constant", { value });
  }

  /**
   * Adds new attribute variable to the state.
   */
  addAttributeVariable(moduleId, property) {
    return this.addVariable(
      "attribute",
      { property },
      { modules: { module: moduleId } }
    );
  }

  /**
   * Adds new future function to the state.
   */
  addFutureFunction(kind, references) {
    return this.addFunction("future", { kind }, references);
  }

  /**
   * Adds new operation future function to the state.
   */
  addOperationFutureFunction() {
    // TODO: create actual operation here and use it's id instead of "1"
    return this.addFutureFunction("operation", { operations: { root: 1 } });
  }
}
