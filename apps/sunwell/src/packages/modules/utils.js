import { mapObjIndexed } from "ramda"

/**
 * Assigning type field to a module based on it's directory name.
 */
export const transformModules = mapObjIndexed((value, key) => ({
  ...value,
  type: key,
}))
