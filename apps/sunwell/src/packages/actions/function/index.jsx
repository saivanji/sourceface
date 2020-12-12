import React from "react"
import { keys, innerJoin } from "ramda"
import { Reference, Static } from "packages/toolkit"
import { getReference, useEditor, useFunctions } from "packages/factory"

// TODO: rename to "moduleFunction"?

const REFERENCE_TYPE = "modules"
const FIELD = "selected"

export function Root({ action, onConfigChange }) {
  // TODO: have Field/ActionField component to automatically handle value/onChange?
  const { selectors } = useEditor()
  const functions = useFunctions()

  const selection = getSelection(action)
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
      {!!selection.length && (
        <>
          <span>call</span>
          <Static
            value={action.config.func}
            items={createSuggestions(selection, functions)}
            editionTitle={action.config.func}
            creationTitle="Function"
            onChange={selectFunc}
          />
        </>
      )}
    </>
  )
}

export const serialize = (config, action) => {
  const selection = getSelection(action)

  return [selection, config.func, {}]
}

export const execute = ({ functions }) => (modules, func, args) => {
  let errors = []
  let result = {}

  for (let { id, name } of modules) {
    try {
      result[name] = functions.modules[id][func](args)
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

const getSelection = (action) =>
  getReference(REFERENCE_TYPE, FIELD, action, true)

const createSuggestions = (modules, functions) => {
  return modules.reduce((acc, module) => {
    const items = toSuggestions(functions.modules[module.id])

    if (!acc.length) {
      return items
    }

    return innerJoin((a, b) => a.value === b.value, items, acc)
  }, [])
}

const toSuggestions = (funcs) =>
  keys(funcs).map((key) => ({ title: key, value: key }))
