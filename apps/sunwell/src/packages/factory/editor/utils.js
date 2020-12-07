import { keys } from "ramda"

export const findModuleIdByAction = (actionId, modules) =>
  keys(modules).find((moduleId) => modules[moduleId].actions.includes(actionId))

export const toDict = (field, list) =>
  list.reduce((acc, x) => ({ ...acc, [x[field]]: x }), {})
