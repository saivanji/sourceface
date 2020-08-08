import { values, propEq, mapObjIndexed } from "ramda"

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

export const reverseLayout = layout =>
  values(layout).reduce(
    (acc, { w, h, x, y, data }) => [...acc, { id: data.id, w, h, x, y }],
    []
  )
