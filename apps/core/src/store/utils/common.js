import { keys, zipObj } from "ramda";

/**
 * Maps object values by a provided function. Function can optionally return
 * a Promise.
 *
 * When "debug" parameter is provided, every resulting key/value pair
 * is given as argument to that function.
 */
export function mapObj(fn, obj, debug) {
  const fields = keys(obj);
  const out = fields.map((x) => fn(obj[x]));

  if (out[0] instanceof Promise) {
    return Promise.all(out).then((items) => zipRecord(fields, items, debug));
  }

  return zipRecord(fields, out, debug);
}

/**
 * Combines keys with values into an object. When "debug" is provided,
 * every key/value pair is being called with that function.
 */
export function zipRecord(keys, values, debug) {
  if (debug) {
    values.forEach((item, i) => debug(keys[i], item));
  }

  return zipObj(keys, values);
}
