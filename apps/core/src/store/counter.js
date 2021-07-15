import { BehaviorSubject } from "rxjs";

/**
 * Wrapping BehaviorSubject to be able increment it's current value.
 * Used in futures to invalidate it's cache and execute them again.
 */
export default class Counter extends BehaviorSubject {
  constructor() {
    /**
     * Providing 0 as initial value to creating BehaviorSubject.
     */
    super(0);
  }

  increment() {
    let current;
    this.subscribe((value) => {
      current = value;
    }).unsubscribe();

    this.next(current + 1);
  }
}
