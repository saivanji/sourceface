import { keys } from "ramda"

import * as debug from "./debug"
import * as func from "./function"
import * as operation from "./operation"
import * as redirect from "./redirect"
import * as selector from "./selector"

/**
 * Transforming object to list with keys as "type" field.
 */
const toList = (obj) =>
  keys(obj).reduce((acc, key) => [...acc, { type: key, ...obj[key] }], [])

export const dict = { debug, function: func, operation, redirect, selector }
export const list = toList(dict)
