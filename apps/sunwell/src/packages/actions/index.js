import { keys } from "ramda"

import * as redirect from "./redirect"
import * as runQuery from "./runQuery"

/**
 * Transforming object to list with keys as "type" field.
 */
const toList = (obj) =>
  keys(obj).reduce((acc, key) => [...acc, { type: key, ...obj[key] }], [])

export const dict = { redirect, runQuery }
export const list = toList(dict)
