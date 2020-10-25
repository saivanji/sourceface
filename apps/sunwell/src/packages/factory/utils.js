import { keys } from "ramda"

/**
 * Transforming object to list with keys as "type" field.
 */
export const toList = (obj) =>
  keys(obj).reduce((acc, key) => [...acc, { type: key, ...obj[key] }], [])
