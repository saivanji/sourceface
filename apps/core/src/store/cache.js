import { isNil } from "ramda";
import { from } from "rxjs";
import { switchMap } from "rxjs/operators";
import { shareLatest } from "./operators";
import Version from "./version";
import Expirable from "./expirable";

export default class Cache {
  constructor(ttl) {
    this.ttl = ttl;
    this.version$ = new Version();

    this.data = new Map();
    this.populations = new Map();
  }

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

        const data$ = new Expirable(value, this.ttl, () => this.delete(key));
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

  set(key, value) {
    this.data.set(key, value);
  }

  delete(key) {
    this.data.delete(key);
  }
}
