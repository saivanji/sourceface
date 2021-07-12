import setWith from "lodash.setwith";

export default class FakeStock {
  constructor() {
    this.stock = {};
  }

  contents() {
    return this.stock;
  }

  /**
   * Adds new module definition to the stock.
   */
  addDefinition(type) {
    const definition = new FakeDefinition(type);

    this.stock[type] = definition.content;

    return definition;
  }
}

class FakeDefinition {
  constructor() {
    this.content = { Root: () => {} };
  }

  addAttribute(name, selector, extras) {
    set(this.content, ["attributes", name], { selector, ...extras });

    return this;
  }

  addInitialConfig(config) {
    this.content.initialConfig = config;

    return this;
  }

  addInitialAtoms(atoms) {
    this.content.initialAtoms = atoms;

    return this;
  }
}

const set = (...args) => setWith(...args, Object);
