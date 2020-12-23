import { mergeRight, keys, zipObj } from "ramda"
import { prepare } from "./execution"

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
  mount,
  params,
  modules,
  dependencies
) => {
  if (definition.type === "local") {
    return new Lazy({ moduleId, name: definition.name }, modules, dependencies)
  }

  if (definition.type === "external") {
    return new Lazy(definition, modules, dependencies)
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

// TODO: should accept "onReload"?
class Lazy {
  constructor(payload, modules, dependencies) {
    const module = modules[payload.moduleId]
    const blueprint = dependencies.stock.modules.dict[module.type]
    const fields = blueprint.dependencies.scope[payload.name]
    const selector = blueprint.scope[payload.name]
    const [executions, cache] = prepare(dependencies, fields)

    this.state = mergeRight(
      blueprint.initialState,
      dependencies.store.state[payload.moduleId]
    )
    this.cache = cache
    this.executions = executions
    this.selector = selector
  }

  execute(cachedOnly) {
    if (cachedOnly || this.cache) {
      if (!this.cache) {
        // TODO: probably should throw error
        return null
      }

      return this.selector(...this.cache, this.state)
    }

    return Promise.all(this.executions.map((fn) => fn())).then((data) =>
      this.selector(...data, this.state)
    )
  }
}

export const createVariable = (
  definition,
  moduleId,
  mount,
  params,
  dependencies,
  { modules, actions }
) => {
  const id = identifyVariable(definition)
  const data = evaluateVariable(
    definition,
    moduleId,
    mount,
    params,
    modules,
    dependencies
  )

  return {
    id,
    definition,
    view: renderVariable(definition, { modules, actions }),
    get: (runtime, cachedOnly) => {
      return data instanceof Lazy
        ? data.execute(cachedOnly)
        : runtime?.[id] || data
    },
  }
}

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
