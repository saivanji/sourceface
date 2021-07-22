import { isNil } from "ramda";
import { from, BehaviorSubject } from "rxjs";
import { switchMap } from "rxjs/operators";
import { shareLatest } from "./operators";
import Version from "./version";

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

  getOr(key, exec, { onStart }) {
    return this.version$.pipe(
      switchMap(() => {
        const cached = this.data.get(key);

        if (!isNil(cached)) {
          return cached;
        }

        onStart();

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
      switchMap((value) => {
        /**
         * Removing population since it's relevant only during execution to be shared
         * across multiple subscribers.
         */
        this.populations.delete(key);

        const data$ = new BehaviorSubject(value);
        this.set(key, data$);

        return data$;
      }),
      /**
       * Sharing observable across multiple subscribers. When cache value is accessed
       * during population by multiple clients they'll share the same stream and side-effect
       * defined in "tap" operator above will be executed only once.
       */
      shareLatest()
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

    // TODO: set removal timeout only after data$ has no subscribers
    // and remove timeout if at least one subscriber appears.

    /**
     * Removing data from cache when ttl expired.
     */
    const nextTimeout = setTimeout(() => {
      const data$ = this.data.get(key);

      if (!data$?.observed) {
        this.data.delete(key);
      }
    }, this.ttl);

    this.data.set(key, value);
    this.timeouts.set(key, nextTimeout);
  }
}
