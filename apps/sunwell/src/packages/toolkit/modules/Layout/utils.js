import { pick } from "ramda"

// TODO: consider moving that logic somewhere since it's might be reused in mobile app?
export const createLayout = (parentId, modules) =>
  // TODO: modules is an object
  modules.reduce((acc, module) => {
    if (!module.parentId !== parentId) {
      return acc
    }

    return { ...acc, [module.id]: { ...module.position, data: module } }
  }, {})

export const sanitizePosition = pick(["w", "h", "x", "y"])
