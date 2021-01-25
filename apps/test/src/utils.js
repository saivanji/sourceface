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
