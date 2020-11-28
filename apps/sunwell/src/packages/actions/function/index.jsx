import React from "react"
import { toPairs, innerJoin } from "ramda"
import { Static } from "packages/toolkit"
import { useScope, useEditor } from "packages/factory"

// TODO: rename to "moduleFunction"?

// TODO: should module be relations of an action the same way we have pages/operations? Why relations was introduced for
// pages/operations?
export function Root({ config, onConfigChange }) {
  // TODO: have Field/ActionField component to automatically handle value/onChange?
  const { modulesScope } = useScope()
  const { modules } = useEditor()

  const map = ({ id, name }) => ({ title: name, value: id })

  const selectModules = (value) => onConfigChange("modules", value)
  const selectFunc = (value) => onConfigChange("func", value)
  const len = config.modules?.length
  const editionTitle =
    len &&
    (len > 1
      ? `${len} modules`
      : modules.find((x) => x.id === config.modules[0]).name)

  return (
    <>
      <span>For</span>
      <Static
        multiple
        creationTitle="Modules"
        editionTitle={editionTitle}
        value={config.modules}
        map={map}
        items={modules}
        onChange={selectModules}
      />
      {!!len && (
        <>
          <span>call</span>
          <Static
            value={config.func}
            items={createFunctionsList(config.modules, modules, modulesScope)}
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

// TODO: whether "scope" should be passed the same way as we pass effects?
// most likely should get functions from "functions" object since functions
// are not part of a scope
export const execute = ({ scope }) => (moduleIds, func, args) => {
  let errors = []
  let result = {}

  for (let moduleId of moduleIds) {
    try {
      // TODO: have module name instead
      result[moduleId] = scope.modulesScope[moduleId][func](args)
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

const createFunctionsList = (moduleIds, modules, modulesScope) => {
  return moduleIds.reduce((acc, id) => {
    const scope = modulesScope[id]
    const funcs = getFunctions(scope)

    if (!acc.length) {
      return funcs
    }

    return innerJoin((a, b) => a.value === b.value, funcs, acc)
  }, [])
}

const getFunctions = (scope) =>
  toPairs(scope)
    .filter(([, value]) => typeof value === "function")
    .map(([key]) => ({ title: key, value: key }))
