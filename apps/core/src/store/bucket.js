import { isNil } from "ramda";

/**
 * Read only data storage. When desired entry does not exists, a new one is
 * created with "createEntry" function.
 */
export default class Bucket {
  constructor(createEntry) {
    this.data = new Map();
    this.createEntry = createEntry;
  }

  retrieve(...path) {
    const key = this.key(path);
    let result = this.data.get(key);

    if (isNil(result)) {
      result = this.createEntry();
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
