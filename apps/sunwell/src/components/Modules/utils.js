import { toPairs, pick } from "ramda"

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
  const module = modules.find((module) => module.positionId === positionId)

  return {
    ...module,
    layers: module.layouts.map((layout) => createLayer(layout, modules)),
  }
}

/**
 * Extracting only changed positions or positions which are not in a
 * previous layout for the grid reorder request.
 */
export const toPositionsRequest = (prevLayer, units) =>
  toPairs(units).reduce(
    (acc, [id, unit]) => {
      const prevPosition = prevLayer.units[id]
      const position = pick(["w", "h", "x", "y"], unit)

      if (prevPosition && positionsEqual(prevPosition, position)) {
        return acc
      }

      return [
        ...acc,
        {
          id: +id,
          layoutId: prevLayer.layoutId,
          ...position,
        },
      ]
    },

    []
  )

export const positionsEqual = (a, b) =>
  a.w === b.w && a.h === b.h && a.x === b.x && a.y === b.y
