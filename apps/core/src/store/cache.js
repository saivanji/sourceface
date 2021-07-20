import { isNil } from "ramda";
import { of, from } from "rxjs";
import { switchMap, tap, shareReplay } from "rxjs/operators";
import Version from "./version";

// TODO: with timeout cache invalidation, we might have the case when existing data is displayed, became
// stale and therefore deleted, new component rendered, fetched new data. So the new component will have
// new data and old will have the previous version of the data. In that case we need to refetch all existing
// data streams but without emitting "WAITING".
// Alternatively have data as static completed stream and keep reference counting on cached data and clear cache only when it has no references.
export default class Cache {
  constructor(ttl) {
    this.ttl = ttl;
    this.version$ = new Version();

    this.data = new Map();
    this.populations = new Map();
    this.timeouts = new Map();
  }

  // TODO: what if we invalidate in the middle of population?
  invalidate() {
    this.data = new Map();
    this.version$.increment();
  }

  getOr(key, exec, { start }) {
    return this.version$.pipe(
      switchMap(() => {
        const cached = this.data.get(key);

        if (!isNil(cached)) {
          return of(cached);
        }

        start?.();

        return this.populate(key, exec);
      })
    );
  }

  /**
   * Returns shared stream of data population.
   */
  populate(key, exec) {
    const existing$ = this.populations.get(key);

    if (!isNil(existing$)) {
      return existing$;
    }

    const new$ = from(exec()).pipe(
      tap((value) => {
        /**
         * Removing population since it's relevant only during execution to be shared
         * across multiple subscribers.
         */
        this.populations.delete(key);

        this.set(key, value);
      }),
      /**
       * Sharing observable across multiple subscribers. When cache value is accessed
       * during population by multiple clients they'll share the same stream and side-effect
       * defined in "tap" operator above will be executed only once.
       */
      shareReplay(1)
    );

    this.populations.set(key, new$);

    return new$;
  }

  /**
   * Setting value to cache and scheduling timeout for that data removal.
   */
  set(key, value) {
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
      // TODO: implement reference counting
      this.cache.delete(key);
    }, this.ttl);

    this.data.set(key, value);
    this.timeouts.set(key, nextTimeout);
  }
}
