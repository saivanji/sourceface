import React from "react"
import { keys, innerJoin } from "ramda"
import { Static } from "packages/toolkit"
import { useEditor, useFunctions } from "packages/factory"

// TODO: rename to "moduleFunction"?

// TODO: should module be relations of an action the same way we have pages/operations? Why relations was introduced for
// pages/operations?
export function Root({ config, onConfigChange }) {
  // TODO: have Field/ActionField component to automatically handle value/onChange?
  const { modules, selectors } = useEditor()
  const functions = useFunctions()

  const map = ({ id, name }) => ({ title: name, value: id })

  const selectModules = (value) => onConfigChange("modules", value)
  const selectFunc = (value) => onConfigChange("func", value)
  const len = config.modules?.length
  const editionTitle =
    len && (len > 1 ? `${len} modules` : modules[config.modules[0]].name)

  return (
    <>
      <span>For</span>
      <Static
        multiple
        creationTitle="Modules"
        editionTitle={editionTitle}
        value={config.modules}
        map={map}
        items={selectors.modules()}
        onChange={selectModules}
      />
      {!!len && (
        <>
          <span>call</span>
          <Static
            value={config.func}
            items={createSuggestions(config.modules, functions)}
            editionTitle={config.func}
            creationTitle="Function"
            onChange={selectFunc}
          />
        </>
      )}
    </>
  )
}

export const serialize = (config) => {
  return [config.modules, config.func, {}]
}

export const execute = ({ functions, modules }) => (moduleIds, func, args) => {
  let errors = []
  let result = {}

  for (let moduleId of moduleIds) {
    try {
      const { name } = modules[moduleId]
      result[name] = functions.modules[moduleId][func](args)
    } catch (err) {
      errors.push(err)
    }
  }

  if (errors.length) {
    throw errors
  }

  return result
}

export const settings = {
  effect: true,
}

const createSuggestions = (moduleIds, functions) => {
  return moduleIds.reduce((acc, id) => {
    const items = toSuggestions(functions.modules[id])

    if (!acc.length) {
      return items
    }

    return innerJoin((a, b) => a.value === b.value, items, acc)
  }, [])
}

const toSuggestions = (funcs) =>
  keys(funcs).map((key) => ({ title: key, value: key }))
