import { toPairs, pick } from "ramda"

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
