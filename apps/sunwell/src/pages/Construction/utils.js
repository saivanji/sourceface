import { keys } from "ramda"
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
    (acc, module) => ({ ...acc, [module.id]: module.position }),
    {}
  )

export const reversePositions = positions =>
  // TODO: remove cast to int when id will have string type
  keys(positions).reduce(
    (acc, id) => [...acc, { id: +id, ...positions[id] }],
    []
  )
