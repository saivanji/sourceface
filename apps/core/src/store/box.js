import { keys, zipObj } from "ramda";

// TODO: improve explanation
/**
 * After the computation we might have either Promise or regular data.
 * Because of nature of a Promise, even it has non async data inside,
 * it takes one loop to resolve it's data which causes spinner to
 * display short amount of time in the UI, which could be avoided.
 *
 * That data structure represents data which can be either Promise or regular data.
 * If it's a regular data - we can extract it immediately.
 */
export default class Box {
  constructor(data) {
    this.data = data;
  }

  unwrap() {
    return this.data;
  }

  /**
   * If data is a Promise, we resolve it and after apply function
   * on a result, otherwise simply applying function on data.
   */
  pipe(fn) {
    const f = (x) => {
      const result = fn(x);
      return result instanceof Box ? result.unwrap() : result;
    };

    const result =
      this.data instanceof Promise ? this.data.then(f) : f(this.data);

    return new Box(result);
  }

  /**
   * If either one consumed item is Promise, we group the whole list in a Promise
   * and give it to the Box, otherwise supply raw consumed data to the Box.
   */
  static all(items) {
    let result = [];
    let hasPromise = false;

    for (let item of items) {
      const raw = item.unwrap();

      if (raw instanceof Promise) {
        hasPromise = true;
      }

      result.push(raw);
    }

    if (hasPromise) {
      return new Box(Promise.all(result));
    }

    return new Box(result);
  }

  /**
   * Maps over a list of items where applied function returns Box.
   */
  static map(fn, arr) {
    return Box.all(arr.map(fn));
  }

  /**
   * Maps over the object where applied function returns Box.
   */
  // TODO: use "for in" for the traversal
  static mapObj(fn, obj) {
    const fields = keys(obj);

    return Box.map((x) => fn(obj[x]), fields).pipe((value) =>
      zipObj(fields, value)
    );
  }

  /**
   * Reducing given list where applied function returns Box. Going to the
   * next iteration after current iteration Box is resolved.
   */
  static reduce(fn, acc, arr) {
    if (arr.length === 0) {
      return new Box(acc);
    }

    const [head, ...tail] = arr;
    const data = fn(acc, head);

    return data.pipe((data) => this.reduce(fn, data, tail));
  }
}
