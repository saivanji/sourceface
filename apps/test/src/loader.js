import stringify from "fast-json-stable-stringify";

let queue = {};

/**
 * Function responsible for calling a function, handling cahing and
 * resolving duplicating async requests.
 */
export const load = (id, fn, args, references) => {
  const identifier = identify(id, args);

  /**
   * If nothing is in queue - call a function and emit subscribers in case of async
   * call or return plain value otherwise.
   */
  if (!queue[identifier]) {
    const result = fn(args, references);

    if (result instanceof Promise) {
      result.then((data) => {
        emit(identifier, data, false);
      });

      result.catch((err) => {
        emit(identifier, err, true);
      });
    } else {
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
