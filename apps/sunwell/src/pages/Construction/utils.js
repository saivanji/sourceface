import { toPairs, propEq, mapObjIndexed } from "ramda"

export const transformModules = mapObjIndexed((value, key) => ({
  ...value,
  type: key,
}))

export const createLayout = (modules, positions) =>
  positions.reduce(
    (acc, { id, ...coords }) => ({
      ...acc,
      [id]: { ...coords, data: modules.find(propEq("positionId", id)) },
    }),
    {}
  )

export const layoutToPositions = layout =>
  toPairs(layout).reduce(
    (acc, [id, { w, h, x, y }]) => [...acc, { id: +id, w, h, x, y }],
    []
  )
