import { Observable } from "rxjs";

/**
 * Emits given value and counts the amount of subscribers. Executes
 * onExpire function after provided ttl when stream reaches 0 subscribers.
 */
export default class Expirable extends Observable {
  constructor(value, ttl, onExpire) {
    const subscribe = (observer) => {
      clearTimeout(this.timeout);

      this.refCount++;
      observer.next(value);

      return () => {
        this.refCount--;

        if (this.refCount === 0) {
          this.timeout = setTimeout(onExpire, ttl);
        }
      };
    };

    super(subscribe);

    this.refCount = 0;
    // TODO: most likely will need to schedule expiration right in the constructor since it has 0 subscribers.
    // It will be removed if in given ttl time frame someone will subscribe
  }
}
