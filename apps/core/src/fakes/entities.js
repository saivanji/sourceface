import { keys } from "ramda";

export default class FakeEntities {
  constructor() {
    this.entities = {
      modules: {},
      stages: {},
      values: {},
    };
  }

  contents() {
    return this.entities;
  }

  /**
   * Returns next id for a desired entities.
   */
  getNextId(entitiesKey) {
    const ids = keys(this.entities[entitiesKey]);

    if (ids.length === 0) {
      return 1;
    }

    return Math.max(...ids) + 1;
  }

  /**
   * Adds new entity
   */
  addEntity(key, data) {
    const entityId = this.getNextId(key);

    this.entities[key][entityId] = data;

    return {
      id: entityId,
      ...data,
    };
  }

  /**
   * Adds new value
   */
  addValue(category, payload, { references, path, args } = {}) {
    return this.addEntity("values", {
      category,
      payload,
      references,
      args,
      path,
    });
  }

  /**
   * Adds new module
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
   * Adds new stage
   */
  addStage(type, values) {
    return this.addEntity("stages", {
      order: 0,
      name: "stage_1",
      type,
      values,
    });
  }

  /**
   * Adds new value stage
   */
  addValueStage(valueId) {
    return this.addStage("value", { root: valueId });
  }

  /**
   * Adds new variable
   */
  addVariable(type, payload, extras) {
    return this.addValue(`variable/${type}`, payload, extras);
  }

  /**
   * Adds new function
   */
  addFunction(type, payload, extras) {
    return this.addValue(`function/${type}`, payload, extras);
  }

  /**
   * Adds new constant
   */
  addConstantVariable(value, extras) {
    return this.addVariable("constant", { value }, extras);
  }

  /**
   * Adds new attribute
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
   * Adds new input
   */
  addInputVariable(path) {
    return this.addVariable("input", undefined, { path });
  }

  /**
   * Adds new future function
   */
  addFutureFunction(kind, args, references) {
    return this.addFunction("future", { kind }, { args, references });
  }
}
