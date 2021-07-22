import { Observable } from "rxjs";

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
  }
}
