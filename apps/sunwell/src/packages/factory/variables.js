import { keys } from "ramda"

export const createDefinitions = (
  moduleId,
  actionId,
  scope,
  modulesList,
  actionsList
) => {
  return [
    ...createModulesDefinitions(moduleId, modulesList, scope),
    ...createActionsDefinitions(actionId, actionsList),
    ...createStateDefinitions({}),
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

  if (a === "state") {
    return {
      type: "state",
      key: b,
    }
  }
}

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

  if (definition.type === "state") {
    return `state/${definition.key}`
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

  if (definition.type === "state") {
    return `[state] ${definition.key}`
  }
}

export const createVariable = (
  definition,
  moduleId,
  globalScope,
  mountScope,
  { modules, actions }
) => {
  const data = evaluateVariable(definition, moduleId, globalScope, mountScope)
  const id = identifyVariable(definition)

  return {
    definition,
    id,
    view: renderVariable(definition, { modules, actions }),
    get: (runtime) => runtime?.[id] || data,
    data,
  }
}

export const evaluateVariable = (
  definition,
  moduleId,
  globalScope,
  state,
  mountScope
) => {
  if (definition.type === "local") {
    return globalScope.modules[moduleId][definition.name]
  }

  if (definition.type === "external") {
    return globalScope.modules[definition.moduleId][definition.name]
  }

  if (definition.type === "action") {
    return new Runtime(definition)
  }

  if (definition.type === "mount") {
    return mountScope[moduleId]
  }

  if (definition.type === "state") {
    return state[definition.key]
  }
}

// TODO: instead of "scope", get module's variables from it's type definitions
const createModulesDefinitions = (moduleId, modulesList, scope) =>
  modulesList.reduce((acc, m) => {
    const moduleScope = scope.modules[m.id]

    if (!moduleScope) {
      return acc
    }

    // TODO: create "mount" type when:
    // - modules are parents of the current module
    // - and they have "@mount" action created

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

    return [...acc, ...data]
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

const createStateDefinitions = (state) =>
  keys(state).reduce((acc, key) => [...acc, { type: "state", key }], [])

class Runtime {
  constructor(definition) {
    this.definition = definition
  }
}

// variable has
// - id
// - view (rendered title)
// - definition (variable itself)
// - data
