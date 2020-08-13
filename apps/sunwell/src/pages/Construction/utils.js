import { toPairs, mapObjIndexed } from "ramda"

/**
 * Assigning type to a module.
 */
export const transformModules = mapObjIndexed((value, key) => ({
  ...value,
  type: key,
}))

/**
 * Creating recursive layout data for the grid.
 */
export const createLayout = (id, modules, positions) => ({
  id,
  positions: positions.reduce(
    (acc, { id, ...coords }) => ({
      ...acc,
      [id]: {
        ...coords,
        data: createModule(id, modules),
      },
    }),
    {}
  ),
})

/**
 * Creating a module object with recursive layouts data.
 */
const createModule = (id, modules) => {
  const module = modules.find(module => module.position.id === id)

  return {
    ...module,
    layouts: module.layouts.map(layout =>
      createLayout(layout.id, modules, layout.positions)
    ),
  }
}

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
