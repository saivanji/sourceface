import React from "react"
import { keys, innerJoin } from "ramda"
import { Reference, Static } from "packages/toolkit"
import {
  getReference,
  useAction,
  useEditor,
  useFunctions,
} from "packages/factory"

// TODO: rename to "moduleFunction"?

const REFERENCE_TYPE = "modules"
const FIELD = "selected"

export function Root({ config, onConfigChange }) {
  // TODO: have Field/ActionField component to automatically handle value/onChange?
  const { selectors } = useEditor()
  const { references } = useAction()
  const functions = useFunctions()

  const selection = getReference(REFERENCE_TYPE, FIELD, references, true)

  // console.log(selection, references, REFERENCE_TYPE, FIELD)

  const selectFunc = (value) => onConfigChange("func", value)
  const editionTitle =
    selection.length > 1 ? `${selection.length} modules` : selection[0]?.name

  return (
    <>
      <span>For</span>
      <Reference
        multiple
        type={REFERENCE_TYPE}
        titleKey="name"
        creationTitle="Modules"
        field={FIELD}
        editionTitle={editionTitle}
        items={selectors.modules()}
      />
    </>
  )
}

//       {!!selection.length && (
//         <>
//           <span>call</span>
//           <Static
//             value={config.func}
//             items={createSuggestions(config.modules, functions)}
//             editionTitle={config.func}
//             creationTitle="Function"
//             onChange={selectFunc}
//           />
//         </>
//       )}

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
