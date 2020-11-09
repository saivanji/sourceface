import { keys } from "ramda"

import * as redirect from "./redirect"
import * as operation from "./operation"

/**
 * Transforming object to list with keys as "type" field.
 */
const toList = (obj) =>
  keys(obj).reduce((acc, key) => [...acc, { type: key, ...obj[key] }], [])

export const dict = { redirect, operation }
export const list = toList(dict)
