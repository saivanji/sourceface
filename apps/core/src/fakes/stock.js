import produce from "immer";

export default class FakeStock {
  constructor() {
    this.stock = {};
  }

  contents() {
    return this.stock;
  }

  updateStock(fn) {
    this.stock = produce(this.stock, fn);
  }

  /**
   * Adds new module definition to the stock.
   */
  addDefinition(type, { Root = () => {}, ...optionalSetup }) {
    this.updateStock((stock) => {
      stock[type] = { Root, ...optionalSetup };
    });
  }
}
