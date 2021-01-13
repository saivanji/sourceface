/**
 * Asynchronous list transformation based on a function
 * returning Promise.
 *
 * Uses "maybePromise" under the hood so result be might be plain value.
 */
export const reduce = (fn, acc, [head, ...tail]) => {
  if (!head) {
    return acc;
  }

  return maybePromise([fn(acc, head)], ([nextAcc]) => {
    if (!tail.length) {
      return nextAcc;
    }

    return reduce(fn, nextAcc, tail);
  });
};

/**
 * Transforming list of values where items can be optionally Promises.
 *
 * The key point is to return Promise if at least one value in a list is a Promise
 * or return plain value otherwise.
 */
export const maybePromise = (items = [], fn = (x) => x) => {
  const isPromise = items.some((x) => x instanceof Promise);

  if (isPromise) {
    return Promise.all(items).then((result) => fn(result));
  }

  return fn(items);
};
