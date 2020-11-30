import React from "react"
import { update, applySpec } from "ramda"
import { Value } from "packages/toolkit"

export function Root({ config: { variables = [] }, onConfigChange }) {
  const addVariable = (variable) =>
    onConfigChange("variables", [...variables, variable])
  const changeVariable = (variable, i) =>
    onConfigChange("variables", update(i, variable, variables))

  return (
    <>
      <span>Debug</span>
      {variables.map((variable, i) => (
        <Value
          key={i}
          value={variable}
          onChange={(variable) => changeVariable(variable, i)}
        />
      ))}
      <Value creationTitle="Add variable" onChange={addVariable} />
    </>
  )
}

export const serialize = (
  { variables = [] },
  relations,
  { evaluate, render }
) => {
  return [
    variables.map(
      applySpec({
        title: render,
        value: evaluate,
      })
    ),
  ]
}

export const execute = () => (items) => {
  for (let item of items) {
    console.log(
      `Variable: %c${item.title}. %cValue: %c${item.value}`,
      "color: blue",
      "color: black",
      "color: green"
    )
  }
}

export const settings = {
  effect: true,
}
