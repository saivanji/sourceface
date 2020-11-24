import { keys } from "ramda"

import * as func from "./function"
import * as operation from "./operation"
import * as redirect from "./redirect"

/**
 * Transforming object to list with keys as "type" field.
 */
const toList = (obj) =>
  keys(obj).reduce((acc, key) => [...acc, { type: key, ...obj[key] }], [])

export const dict = { function: func, operation, redirect }
export const list = toList(dict)
