import React from "react"
import { keys, T } from "ramda"
import { Autocomplete } from "@sourceface/components"
import { useContainer, useConfiguration } from "packages/factory"

export default function Variables({ filter = T, onItemClick }) {
  const { modulesScope, modules } = useContainer()
  const { module } = useConfiguration()

  const modulesVariables = createModulesVariables(
    module.id,
    modules,
    modulesScope,
    filter,
    (variable, title, i) => (
      <Autocomplete.Item key={i} onClick={() => onItemClick(variable, title)}>
        {title}
      </Autocomplete.Item>
    )
  )

  return <>{modulesVariables}</>
}

const createModulesVariables = (
  selectedId,
  modules,
  modulesScope,
  filter,
  fn
) =>
  modules.reduce((acc, m) => {
    const scope = modulesScope[m.id]

    if (!scope) {
      return acc
    }

    const isLocal = m.id === selectedId
    const data = keys(scope).reduce((acc, name) => {
      const variable = isLocal
        ? {
            type: "local",
            name,
          }
        : {
            type: "external",
            name,
            moduleId: m.id,
          }

      if (!filter(variable, scope[name])) {
        return acc
      }

      return [
        ...acc,
        fn(
          variable,
          // TODO: move to the Variables component 2 lines below?
          `[${variable.type}] ${m.name}.${name}`,
          `module-${m.id}-${name}`
        ),
      ]
    }, [])

    return [...acc, ...data]
  }, [])
