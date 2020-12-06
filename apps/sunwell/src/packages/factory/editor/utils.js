import { keys } from "ramda"

export const findModuleIdByAction = (actionId, modules) =>
  keys(modules).find((moduleId) => modules[moduleId].actions.includes(actionId))
