import React from "react"
import { update } from "ramda"
import { Value } from "packages/toolkit"

export function Root({ action, onConfigChange }) {
  const { definitions = [] } = action.config
  const add = (definition) =>
    onConfigChange("definitions", [...definitions, definition])
  const change = (definition, i) =>
    onConfigChange("definitions", update(i, definition, definitions))

  // TODO: do not show variable after action name was removed
  return (
    <>
      <span>Debug</span>
      {definitions.map((definition, i) => (
        <Value
          key={i}
          value={definition}
          onChange={(definition) => change(definition, i)}
        />
      ))}
      <Value creationTitle="Add" onChange={add} />
    </>
  )
}

export const serialize = ({ definitions = [] }, action, { createVariable }) => {
  return [definitions.map(createVariable)]
}

// TODO: might need to return the result of previous evaluation not to
// break when used in the end of a pipe
export const execute = ({ runtime }) => (variables) => {
  for (let variable of variables) {
    console.log(
      `Variable: %c${variable.view}. %cValue: %c${JSON.stringify(
        variable.get(runtime)
      )}`,
      "color: blue",
      "color: black",
      "color: green"
    )
  }
}

export const settings = {
  effect: true,
  nameless: true,
}
