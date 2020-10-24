// TODO: move to "actions" package and configuration components will be moved to toolkit?

import { values, mapObjIndexed } from "ramda"
import * as redirect from "./redirect"
import * as runQuery from "./runQuery"

/**
 * Assigning type field to the action based on it's file name.
 */
const transform = mapObjIndexed((value, key) => ({
  ...value,
  type: key,
}))

export const dict = transform({ redirect, runQuery })
export const list = values(dict)
