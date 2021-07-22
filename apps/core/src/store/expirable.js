import { BehaviorSubject } from "rxjs";

// TODO: "unsubscribe" is not called when extending from BehaviorSubject and "subscribe" is overwritten
export default class Expirable extends BehaviorSubject {
  constructor(value, ttl, onExpire) {
    super(value);
    this.ttl = ttl;
    this.onExpire = onExpire;
  }

  subscribe(...args) {
    clearTimeout(this.timeout);

    const subscription = super.subscribe(...args);
    const initial = subscription.unsubscribe.bind(subscription);

    subscription.unsubscribe = (...args) => {
      console.log("unsub");

      const result = initial(...args);

      if (!this.observed) {
        this.timeout = setTimeout(this.onExpire, this.ttl);
      }

      return result;
    };

    return subscription;
  }
}
