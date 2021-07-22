import { BehaviorSubject } from "rxjs";

// TODO: When Subject is unsubscribed internally, different way from calling "unsubscribe" is used
export default class Expirable extends BehaviorSubject {
  constructor(value, ttl, onExpire) {
    super(value);
    this.ttl = ttl;
    this.onExpire = onExpire;
  }

  subscribe(...args) {
    const subscription = super.subscribe(...args);

    clearTimeout(this.timeout);

    console.log("sub");

    return {
      ...subscription,
      unsubscribe(...args) {
        console.log("unsub");
        const result = subscription.unsubscribe(...args);

        if (!this.observed) {
          this.timeout = setTimeout(this.onExpire, this.ttl);
        }

        return result;
      },
    };
  }
}
