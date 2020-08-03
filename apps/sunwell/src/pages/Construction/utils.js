import { values, mapObjIndexed } from "ramda"

export const transformModules = mapObjIndexed((value, key) => ({
  ...value,
  type: key,
}))

export const createLayout = modules =>
  modules.reduce(
    (acc, { position, ...data }) => ({
      ...acc,
      [data.id]: { ...position, data },
    }),
    {}
  )

export const reverseLayout = layout =>
  values(layout).reduce(
    (acc, { w, h, x, y, data }) => [...acc, { id: data.id, w, h, x, y }],
    []
  )
