import { keys, zipObj } from "ramda"

export const createDefinitions = (
  stock,
  module,
  action,
  scope,
  modulesList,
  actionsList,
  params
) => {
  return [
    ...createModulesDefinitions(module.id, modulesList, scope),
    ...createActionsDefinitions(action.id, actionsList),
    ...createParamsDefinitions(params),
    ...createInputDefinitions(
      action.field,
      stock.modules.dict[module.type].inputTypes
    ),
  ]
}

export const defineVariable = (id) => {
  const spec = [
    "local/name",
    "external/moduleId/name",
    "action/actionId",
    "mount/moduleId",
    "params/key",
    "input/key",
  ]

  const [type, ...keys] = id.split("/")

  return spec.reduce((result, item) => {
    const [itemType, ...values] = item.split("/")

    if (result || itemType !== type) {
      return result
    }

    return {
      type,
      // TODO: chances are it might be not needed. Try to implement without it
      __variable: true,
      ...zipObj(keys, values),
    }
  }, null)
}

export const identifyVariable = (definition) => {
  if (definition.type === "local") {
    return `local/${definition.name}`
  }

  if (definition.type === "external") {
    return `module/${definition.moduleId}/${definition.name}`
  }

  if (definition.type === "action") {
    return `action/${definition.actionId}`
  }

  if (definition.type === "mount") {
    return `mount/${definition.moduleId}`
  }

  if (definition.type === "params") {
    return `params/${definition.key}`
  }

  if (definition.type === "input") {
    return `input/${definition.key}`
  }
}

export const renderVariable = (definition, { modules, actions }) => {
  if (definition.type === "local") {
    return `[local] ${definition.name}`
  }

  if (definition.type === "external") {
    return `[external] ${modules[definition.moduleId].name}.${definition.name}`
  }

  if (definition.type === "action") {
    return `[action] ${actions[definition.actionId].name}`
  }

  if (definition.type === "mount") {
    return `[mount] ${modules[definition.moduleId].name}`
  }

  if (definition.type === "params") {
    return `[params] ${definition.key}`
  }

  if (definition.type === "input") {
    return `[input] ${definition.key}`
  }
}

export const evaluateVariable = (
  definition,
  moduleId,
  scope,
  mount,
  params
) => {
  if (
    (definition.type === "local" && !scope[moduleId]) ||
    (definition.type === "external" && !scope[definition.moduleId])
  ) {
    throw new IncompleteEvaluation()
  }

  if (definition.type === "local") {
    return scope[moduleId][definition.name]
  }

  if (definition.type === "external") {
    return scope[definition.moduleId][definition.name]
  }

  if (definition.type === "action" || definition.type === "input") {
    return new Runtime(definition)
  }

  if (definition.type === "mount") {
    return mount[definition.moduleId]
  }

  if (definition.type === "params") {
    return params[definition.key]
  }
}

export const createVariable = (
  definition,
  moduleId,
  scope,
  mount,
  params,
  { modules, actions }
) => {
  const data = evaluateVariable(definition, moduleId, scope, mount, params)
  const id = identifyVariable(definition)

  return {
    definition,
    id,
    view: renderVariable(definition, { modules, actions }),
    get: (runtime) => runtime?.[id] || data,
    data,
  }
}

export class IncompleteEvaluation extends Error {}

// TODO: instead of "scope", get module's variables from it's type definitions
const createModulesDefinitions = (moduleId, modulesList, scope) =>
  modulesList.reduce((acc, m) => {
    const moduleScope = scope[m.id]

    if (!moduleScope) {
      return acc
    }

    const mountDefinition = isMountAvailable(moduleId, m, modulesList)
      ? { type: "mount", moduleId: m.id }
      : null

    const isLocal = m.id === moduleId
    const data = keys(moduleScope).reduce((acc, name) => {
      const definition = isLocal
        ? {
            type: "local",
            name,
          }
        : {
            type: "external",
            name,
            moduleId: m.id,
          }

      return [...acc, definition]
    }, [])

    return mountDefinition
      ? [...acc, ...data, mountDefinition]
      : [...acc, ...data]
  }, [])

const createActionsDefinitions = (actionId, actionsList) => {
  let result = []

  for (let action of actionsList) {
    if (action.id === actionId) {
      break
    }

    if (action.name) {
      result.push({
        type: "action",
        actionId: action.id,
      })
    }
  }

  return result
}

const createParamsDefinitions = (params) =>
  keys(params).reduce((acc, key) => [...acc, { type: "params", key }], [])

const createInputDefinitions = (field, inputTypes = {}) => {
  return keys(inputTypes[field]).reduce(
    (acc, key) => [...acc, { type: "input", key }],
    []
  )
}

class Runtime {
  constructor(definition) {
    this.definition = definition
  }
}

const hasMountAction = (actions) => !!actions.find((a) => a.field === "@mount")

// TODO: mind nesting of any level
const isMountAvailable = (sourceId, target, modulesList) =>
  hasMountAction(target.actions) &&
  (sourceId === target.id ||
    !!modulesList.find((m) => m.id === sourceId && m.parentId === target.id))

// variable has
// - id
// - view (rendered title)
// - definition (variable itself)
// - data
