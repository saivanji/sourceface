import { keys } from "ramda"

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
  const [a, b, c] = id.split("/")

  if (a === "module" && b === "local") {
    return {
      type: "local",
      name: c,
    }
  }

  if (a === "module") {
    return {
      type: "external",
      moduleId: b,
      name: c,
    }
  }

  if (a === "action") {
    return {
      type: "action",
      actionId: b,
    }
  }

  if (a === "mount") {
    return {
      type: "mount",
      moduleId: b,
    }
  }

  if (a === "params") {
    return {
      type: "params",
      key: b,
    }
  }

  if (a === "input") {
    return {
      type: "input",
      key: b,
    }
  }
}

const spec = [
  "module/moduleId/name",
  "action/actionId",
  "mount/moduleId",
  "params/key",
]

export const identifyVariable = (definition) => {
  if (definition.type === "local") {
    return `module/local/${definition.name}`
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
  globalScope,
  mountScope,
  params
) => {
  if (definition.type === "local") {
    return globalScope.modules[moduleId][definition.name]
  }

  if (definition.type === "external") {
    return globalScope.modules[definition.moduleId][definition.name]
  }

  if (definition.type === "action" || definition.type === "input") {
    return new Runtime(definition)
  }

  if (definition.type === "mount") {
    return mountScope[definition.moduleId]
  }

  if (definition.type === "params") {
    return params[definition.key]
  }
}

export const createVariable = (
  definition,
  moduleId,
  globalScope,
  mountScope,
  params,
  { modules, actions }
) => {
  const data = evaluateVariable(
    definition,
    moduleId,
    globalScope,
    mountScope,
    params
  )
  const id = identifyVariable(definition)

  return {
    definition,
    id,
    view: renderVariable(definition, { modules, actions }),
    get: (runtime) => runtime?.[id] || data,
    data,
  }
}

// TODO: instead of "scope", get module's variables from it's type definitions
const createModulesDefinitions = (moduleId, modulesList, scope) =>
  modulesList.reduce((acc, m) => {
    const moduleScope = scope.modules[m.id]

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

const createInputDefinitions = (field, inputTypes) => {
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
