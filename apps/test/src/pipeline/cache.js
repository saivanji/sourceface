import stringify from "fast-json-stable-stringify";

/**
 * Function result cache. Will be removed once Recoil will implement selector caching by it's output
 * (currently it's caching selectors only by their inputs). That will let having module state shape
 * as object without recomputing selectors.
 *
 * See https://github.com/facebookexperimental/Recoil/pull/749 for further detail.
 */

let store = {};
let timeouts = {};
let queue = {};
const TTL = 3 * 60 * 1000;

/**
 * Function responsible for calling a function, handling cahing and
 * resolving duplicating async requests.
 */
export const load = (id, fn, args, references) => {
  const identifier = identify(id, args);
  // const fromCache = store[identifier];

  // if (fromCache) {
  //   return fromCache;
  // }

  /**
   * If nothing is in queue - call a function and emit subscribers in case of async
   * call or return plain value otherwise.
   */
  if (!queue[identifier]) {
    const result = fn(args, references);

    if (result instanceof Promise) {
      result.then((data) => {
        emit(identifier, data, false);
        set(identifier, data);
      });

      result.catch((err) => {
        emit(identifier, err, true);
      });
    } else {
      set(identifier, result);

      return result;
    }
  }

  return wait(identifier);
};

/**
 * Notifying all subscribers for a change.
 */
const emit = (identifier, payload, isError) => {
  const subscriptions = queue[identifier] || [];

  for (let [onSuccess, onError] of subscriptions) {
    (isError ? onError : onSuccess)(payload);
  }

  delete queue[identifier];
};

/**
 * Sets data to a cache.
 */
const set = (identifier, data) => {
  store[identifier] = data;

  clearTimeout(timeouts[identifier]);
  timeouts[identifier] = setTimeout(() => {
    delete store[identifier];
    delete timeouts[identifier];
  }, TTL);
};

/**
 * Waits until promise callbacks will be called in a queue.
 */
const wait = (identifier) =>
  new Promise((resolve, reject) => {
    const prev = queue[identifier] || [];

    queue[identifier] = [...prev, [resolve, reject]];
  });

/**
 * Identification of a specific function by it's id and arguments.
 */
const identify = (id, args) => `${id}/${stringify(args)}`;
