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
      // TODO: in future we might use "nanoid" for id generation, so keeping
      // ids as strings for the ease of migration.
      id: entityId + "",
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
  addModule(type, { parentId, config, fields } = {}) {
    return this.addEntity("modules", {
      position: 0,
      parentId,
      type,
      config,
      fields,
    });
  }

  /**
   * Adds new stage
   */
  addStage(type, values, order = 0) {
    return this.addEntity("stages", {
      order,
      name: `stage_${order + 1}`,
      type,
      values,
    });
  }

  /**
   * Adds new value stage
   */
  addValueStage(valueId, order) {
    return this.addStage("value", { root: valueId }, order);
  }

  /**
   * Adds new dictionary stage
   */
  addDictionaryStage(values, order) {
    return this.addStage("dictionary", values, order);
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
   * Adds new constant variable
   */
  addConstantVariable(value, extras) {
    return this.addVariable("constant", { value }, extras);
  }

  /**
   * Adds new attribute variable
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
   * Adds new stage variable
   */
  addStageVariable(name, extras) {
    return this.addVariable("stage", { name }, extras);
  }

  /**
   * Adds new stage variable
   */
  addInputVariable(path) {
    return this.addVariable("input", undefined, { path });
  }

  /**
   * Adds new stage variable
   */
  addMountVariable(moduleId, path) {
    return this.addVariable("mount", undefined, {
      path,
      references: { modules: { module: moduleId } },
    });
  }

  /**
   * Adds new future function
   */
  addFutureFunction(kind, args, references) {
    return this.addFunction("future", { kind }, { args, references });
  }

  /**
   * Adds new method function
   */
  addMethodFunction(moduleId, property, args) {
    return this.addFunction(
      "method",
      { property },
      { args, references: { modules: { module: moduleId } } }
    );
  }
}
