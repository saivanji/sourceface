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
