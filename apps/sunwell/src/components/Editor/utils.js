import { toPairs, pick } from "ramda"

export const findModule = (moduleId, modules) =>
  modules.find(module => module.id === moduleId)

/**
 * Extracting only changed positions or positions which are not in a
 * previous layout for the grid reorder request.
 */
export const toPositionsRequest = (prevLayout, positions) =>
  toPairs(positions).reduce(
    (acc, [id, item]) => {
      const prevPosition = prevLayout.positions[id]
      const position = pick(["w", "h", "x", "y"], item)

      if (prevPosition && positionsEqual(prevPosition, position)) {
        return acc
      }

      return [
        ...acc,
        {
          id: +id,
          layoutId: prevLayout.id,
          ...position,
        },
      ]
    },

    []
  )

export const positionsEqual = (a, b) =>
  a.w === b.w && a.h === b.h && a.x === b.x && a.y === b.y
