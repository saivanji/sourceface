import { isNil } from "ramda";

export default class Bucket {
  constructor(Item, ...args) {
    this.data = new Map();
    this.create = () => new Item(...args);
  }

  retrieve(...path) {
    const key = this.key(path);
    let result = this.data.get(key);

    if (isNil(result)) {
      result = this.create();
      this.data.set(key, result);
    }

    return result;
  }

  get(...path) {
    const key = this.key(path);
    return this.data.get(key);
  }

  key(path) {
    return path.join("/");
  }
}
