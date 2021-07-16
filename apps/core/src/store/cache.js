import { set } from "./utils";
import { path as get, last } from "ramda";

/**
 * Simple form of caching, stores value by provided path and invalidates it
 * when given ttl reached.
 */
export default class Cache {
  constructor(ttl) {
    this.cache = {};
    this.ttl = ttl;
    this.timeouts = {};
  }

  get(path) {
    return get(path, this.cache);
  }

  set(path, value) {
    /**
     * Clearing previous invalidation timeout if exsits.
     */
    const timeout = get(path, this.timeouts);
    if (timeout) {
      clearTimeout(timeout);
    }

    /**
     * Removing data from cache when ttl expired.
     */
    const nextTimeout = setTimeout(() => {
      this.invalidate(path);
    }, this.ttl);

    set(this.cache, path, value);
    set(this.timeouts, path, nextTimeout);
  }

  invalidate(path) {
    let current = this.cache;

    for (var i = 0; i < path.length - 1; i++) {
      const key = [path[i]];
      current = current?.[key];
    }

    const key = last(path);
    delete current[key];
  }
}
