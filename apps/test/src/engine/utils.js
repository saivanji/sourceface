export const maybePromise = (...args) => {
  const items = args.slice(0, -1);
  const fn = args[args.length - 1];

  const isPromise = items.some((x) => x instanceof Promise);

  if (isPromise) {
    return Promise.all(items).then((result) => fn(...result));
  }

  return fn(...items);
};
