// TODO: improve explanation
/**
 * After the computation we might have either Promise or regular data.
 * Because of nature of a Promise, even it has non async data inside,
 * it takes one loop to resolve which causes spinner to display short
 * amount of time in the UI, which could be avoided.
 *
 * That data structure represents data which can be either Promise or regular data.
 * If it's a regular data - we can extract it immediately.
 */
export class Box {
  constructor(data) {
    this.data = data;
  }

  consume() {
    return this.data;
  }

  // all functions below return Box type

  // TODO: similar to "Promise.then"
  next(fn) {}

  static map(fn, arr) {}

  static mapObj(fn, obj) {}

  static reduce(fn, acc, arr) {}

  static all(items) {}
}
