import { keys } from "ramda"

export const findLayoutIdByModule = (moduleId, layouts) =>
  keys(layouts).find((layoutId) => !!layouts[layoutId].positions[moduleId])

export const findModuleIdByAction = (actionId, modules) =>
  keys(modules).find((moduleId) => modules[moduleId].actions.includes(actionId))
