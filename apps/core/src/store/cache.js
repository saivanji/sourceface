import { set } from "./utils";

/**
 * Simple form of caching, stores value by provided path and invalidates it
 * when given ttl reached.
 */
export default class Cache {
  constructor(ttl) {
    this.cache = {};
    this.ttl = ttl;
  }

  insert(path, value) {}
}
