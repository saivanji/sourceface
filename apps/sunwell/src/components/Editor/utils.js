import { toPairs } from "ramda"

export const findModule = (moduleId, modules) =>
  modules.find(module => module.id === moduleId)

/**
 * Transforming grid layout to positions input for the grid reorder request.
 */
export const toPositionsRequest = (layoutId, layout) =>
  toPairs(layout).reduce(
    (acc, [id, { w, h, x, y }]) => [...acc, { id: +id, layoutId, w, h, x, y }],
    []
  )
