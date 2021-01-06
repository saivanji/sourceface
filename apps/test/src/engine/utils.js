export const plural = (keys = [], fn) =>
  maybePromise(...keys.map(fn), (...args) => args);

export const maybePromise = (...args) => {
  const items = args.slice(0, -1);
  const fn = args[args.length - 1];

  const isPromise = items.some((x) => x instanceof Promise);

  if (isPromise) {
    return Promise.all(items).then((result) => fn(...result));
  }

  return fn(...items);
};

export const reduce = (fn, acc, [head, ...tail]) => {
  if (!head) {
    return acc;
  }

  return maybePromise(fn(acc, head), (nextAcc) => {
    if (!tail.length) {
      return nextAcc;
    }

    return reduce(fn, nextAcc, tail);
  });
};
