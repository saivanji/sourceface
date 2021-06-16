import { keys, zipObj } from "ramda";

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

export const mapObj = (fn, obj) => {
  const fields = keys(obj);
  const out = fields.map((x) => fn(obj[x]));

  if (out[0] instanceof Promise) {
    return out[0].then((first) =>
      Promise.all(out.slice(1)).then((rest) => zipObj(fields, [first, ...rest]))
    );
  }

  return zipObj(fields, out);
};
