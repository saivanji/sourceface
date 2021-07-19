/**
 * Simple form of caching, stores value by provided path and invalidates it
 * when given ttl reached.
 */
export default class Cache {
  constructor(ttl) {
    this.cache = new Map();
    this.timeouts = new Map();
    this.ttl = ttl;
  }

  get(path) {
    const key = this.key(path);
    return this.cache.get(key);
  }

  set(path, value) {
    const key = this.key(path);

    /**
     * Clearing previous invalidation timeout if exsits.
     */
    const timeout = this.timeouts.get(key);
    if (timeout) {
      clearTimeout(timeout);
    }

    /**
     * Removing data from cache when ttl expired.
     */
    const nextTimeout = setTimeout(() => {
      this.cache.delete(key);
    }, this.ttl);

    this.cache.set(key, value);
    this.timeouts.set(key, nextTimeout);
  }

  // type of path should be []string
  key(path) {
    return path.join("/");
  }
}
