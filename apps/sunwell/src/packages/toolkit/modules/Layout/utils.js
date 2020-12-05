import { pick, values, mapObjIndexed } from "ramda"

// TODO: consider moving that logic somewhere since it's might be reused in mobile app?
export const createLayout = (parentId, modules) => {
  let result = {}

  for (let module of values(modules)) {
    if (module.parentId !== parentId) {
      continue
    }

    result[module.id] = { ...module.position, data: module }
  }

  return result
}

export const sanitizePosition = pick(["w", "h", "x", "y"])

export const createUpdates = (parentId, layout) =>
  mapObjIndexed((x) => ({ parentId, position: sanitizePosition(x) }), layout)
