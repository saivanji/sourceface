/**
 * Asynchronous list transformation based on a function
 * returning Promise.
 */
export const reduce = async (fn, acc, [head, ...tail]) => {
  if (!head) {
    return acc;
  }

  const nextAcc = await fn(acc, head);

  if (!tail.length) {
    return nextAcc;
  }

  return reduce(fn, nextAcc, tail);
};

/**
 * Returns first truthy value of items for a given field or the last one otherwise.
 */
export const either = (field, ...items) => {
  for (let item of items) {
    if (item[field]) {
      return item[field];
    }
  }

  return items[items.length - 1][field];
};
