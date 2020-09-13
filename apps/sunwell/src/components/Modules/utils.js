/**
 * Creating recursive layer data for the grid.
 */
export const createLayer = (layout, modules) => ({
  layoutId: layout.id,
  units: layout.positions.reduce(
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
 * Creating a module object with recursive layers data.
 */
const createModule = (positionId, modules) => {
  const module = modules.find(module => module.positionId === positionId)

  return {
    ...module,
    layers: module.layouts.map(layout => createLayer(layout, modules)),
  }
}
