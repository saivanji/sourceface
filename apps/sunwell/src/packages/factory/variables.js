import { keys } from "ramda"

export const createVariables = (moduleId, actionId, scope, modules) => {
  return [...createModulesVariables(moduleId, modules, scope)]
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
}

export const identifyVariable = (definition) => {
  if (definition.type === "local") {
    return `module/local/${definition.name}`
  }

  if (definition.type === "external") {
    return `module/${definition.moduleId}/${definition.name}`
  }
}

export const renderVariable = (definition, modules) => {
  if (definition.type === "local") {
    return `[local] ${definition.name}`
  }

  if (definition.type === "external") {
    const module = modules.find((m) => m.id === definition.moduleId)

    return `[external] ${module.name}.${definition.name}`
  }
}

export const evaluateVariable = (definition, scope, moduleId) => {
  if (definition.type === "local") {
    return scope.modules[moduleId][definition.name]
  }

  if (definition.type === "external") {
    return scope.modules[definition.moduleId][definition.name]
  }
}

const createModulesVariables = (moduleId, modules, scope) =>
  modules.reduce((acc, m) => {
    const moduleScope = scope.modules[m.id]

    if (!moduleScope) {
      return acc
    }

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

      const variable = {
        view: renderVariable(definition, modules),
        definition,
        data: moduleScope[name],
      }

      return [...acc, variable]
    }, [])

    return [...acc, ...data]
  }, [])

// variable has
// - id
// - view (rendered title)
// - definition (variable itself)
// - data
