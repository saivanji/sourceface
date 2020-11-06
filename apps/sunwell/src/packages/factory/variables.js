import { keys } from "ramda"
import { useEditor } from "./editor"
import { useScope } from "./scope"

export const useVariables = (moduleId) => {
  const { modulesScope } = useScope()
  const { modules } = useEditor()

  const define = (id) => {
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

  const identify = (definition) => {
    if (definition.type === "local") {
      return `module/local/${definition.name}`
    }

    if (definition.type === "external") {
      return `module/${definition.moduleId}/${definition.name}`
    }
  }

  const render = (definition) => {
    if (definition.type === "local") {
      return `[local] ${definition.name}`
    }

    if (definition.type === "external") {
      const module = modules.find((m) => m.id === definition.moduleId)

      return `[external] ${module.name}.${definition.name}`
    }
  }

  const evaluate = (definition) => {
    if (definition.type === "local") {
      return modulesScope[moduleId][definition.name]
    }

    if (definition.type === "external") {
      return modulesScope[definition.moduleId][definition.name]
    }
  }

  const variables = createModulesVariables(
    moduleId,
    modules,
    modulesScope,
    render
  )

  return {
    variables,
    define,
    identify,
    render,
    evaluate,
  }
}

const createModulesVariables = (selectedId, modules, modulesScope, render) =>
  modules.reduce((acc, m) => {
    const scope = modulesScope[m.id]

    if (!scope) {
      return acc
    }

    const isLocal = m.id === selectedId
    const data = keys(scope).reduce((acc, name) => {
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
        view: render(definition),
        definition,
        data: scope[name],
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
