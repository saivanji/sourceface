import { keys } from "ramda"
import { useContainer, useConfiguration } from "packages/factory"

// TODO: use map/filter in the autocomplete instead
// TODO: should identify by definition?
export const useVariables = () => {
  const { modulesScope, modules } = useContainer()
  const { module } = useConfiguration()

  const variables = createModulesVariables(module.id, modules, modulesScope)
  const match = (definition) => {
    // if (definition.type === "local") {
    //   return {
    //     view: types.module.render(module, definition),
    //     definition,
    //     data: modulesScope[module.id][name],
    //   }
    // }
    // if (definition.type === "external") {
    //   const module = modules.find((m) => m.id === definition.moduleId)
    //   return {
    //     view: types.module.render(module, definition),
    //     definition,
    //     data: modulesScope[module.id][name],
    //   }
    // }
  }

  const identify = (definition) => {
    if (definition.type === "local") {
      return `module-local-${definition.name}`
    }

    if (definition.type === "external") {
      return `module-${definition.moduleId}-${definition.name}`
    }
  }

  const define = (id) => {
    const [a, b, c] = id.split("-")

    if (a === "module" && b === "local") {
      return {
        type: "local",
        name: c,
      }
    }

    if (a === "module") {
      return {
        type: "local",
        moduleId: b,
        name: c,
      }
    }
  }

  return {
    variables,
    match,
    identify,
    define,
  }
}

const createModulesVariables = (selectedId, modules, modulesScope) =>
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
        view: `[${definition.type}] ${m.name}.${definition.name}`,
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
