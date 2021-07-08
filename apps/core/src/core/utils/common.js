import setWith from "lodash.setwith";
import { keys, zipObj, path } from "ramda";

// TODO: give *Async more meaningful name

/**
 * Maps object values by a provided function. Function can optionally return
 * a Promise.
 *
 * When "debug" parameter is provided, every resulting key/value pair
 * is given as argument to that function.
 */
// TODO: use "for in" for the traversal
// TODO: combine with "cleanMapObj"
export function mapObjectAsync(fn, obj) {
  const fields = keys(obj);
  const out = fields.map((x) => fn(obj[x]));

  // TODO: consider either one Promise instead of only the first one?
  if (out[0] instanceof Promise) {
    return Promise.all(out).then((items) => zipObj(fields, items));
  }

  return zipObj(fields, out);
}

/**
 * Maps over given object and skips the fields where supplied function
 * returned undefined.
 *
 * @param {function} fn function to apply on every object field/value pair.
 * @param {object} obj object to be mapped.
 * @returns {object} resulting object
 */
export function cleanMapObj(fn, obj) {
  let result;

  for (let key in obj) {
    const data = fn(obj[key], key);

    if (typeof data !== "undefined") {
      if (!result) {
        result = {
          [key]: data,
        };
      } else {
        result[key] = data;
      }
    }
  }

  return result;
}

/**
 * Maps over a list of items applying given function on every iteration.
 * If function returns Promise at least one time then all mapped items are
 * resolved asynchronously and Promise is returned from the function below.
 */
export function mapAsync(fn, list) {
  let result = [];
  let hasPromise = false;

  for (let item of list) {
    const data = fn(item);

    if (data instanceof Promise) {
      hasPromise = true;
    }

    result.push(data);
  }

  if (hasPromise) {
    return Promise.all(result);
  }

  return result;
}

/**
 * Reduces a given list to the value returned from the supplied function.
 * If at any iteration that function returns a Promise, we go to the next
 * iteration after the mentioned Promise resolved and therefore Promise is
 * returned from the function below.
 */
export function reduceAsync(fn, acc, items) {
  if (items.length === 0) {
    return acc;
  }

  const [head, ...tail] = items;
  const result = fn(acc, head);

  if (result instanceof Promise) {
    return result.then((result) => reduceAsync(fn, result, tail));
  }

  return reduceAsync(fn, result, tail);
}

/**
 * Returns data at a path of the supplied object. If object is a Promise
 * then we wait for it's resution before calculate path.
 */
export function pathAsync(p, obj) {
  if (obj instanceof Promise) {
    return obj.then(path(p));
  }

  return path(p, obj);
}

export const set = (...args) => setWith(...args, Object);

/**
 * If provided input is a Promise, we resolve it and after apply function
 * on a result, otherwise simply applying function on provided data.
 */
export function pipe(x, fn) {
  if (x instanceof Promise) {
    return x.then(fn);
  }

  return fn(x);
}

/**
 * If provided items has at least one Promise, we resolve it and after apply
 * function on a result, otherwise simply applying function on provided items.
 */
export function all(items, fn) {
  for (let item of items) {
    if (item instanceof Promise) {
      return Promise.all(items).then(fn);
    }
  }

  return fn(items);
}
