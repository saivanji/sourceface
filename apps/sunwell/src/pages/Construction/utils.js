import { keys, values } from "ramda"
import camelCase from "camelcase"

export const createModulesMap = modules =>
  keys(modules).reduce((acc, key) => {
    const Module = modules[key]

    Module.type = camelCase(key)

    return {
      ...acc,
      [Module.type]: Module,
    }
  }, {})

export const toPositions = modules =>
  modules.reduce(
    (acc, { position, ...data }) => ({
      ...acc,
      [data.id]: { ...position, data },
    }),
    {}
  )

export const reversePositions = positions =>
  values(positions).reduce(
    (acc, { w, h, x, y, data }) => [...acc, { id: data.id, w, h, x, y }],
    []
  )
