import { toPairs, mapObjIndexed } from "ramda"

export const transformModules = mapObjIndexed((value, key) => ({
  ...value,
  type: key,
}))

export const createLayout = positions =>
  positions.reduce(
    (acc, { id, module, ...coords }) => ({
      ...acc,
      [id]: {
        ...coords,
        data: module,
      },
    }),
    {}
  )

export const findModule = (moduleId, positions) =>
  positions.find(position => position.module.id === moduleId).module

export const layoutToPositions = (layoutId, layout) =>
  toPairs(layout).reduce(
    (acc, [id, { w, h, x, y }]) => [...acc, { id: +id, layoutId, w, h, x, y }],
    []
  )
