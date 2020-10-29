import React from "react"
import { Autocomplete, Toggle } from "@sourceface/components"
import { useVariables } from "../../hooks"
import Snippet from "../Snippet"
import Placeholder from "../Placeholder"

// TODO: remove icons, have only colors for variable types/literals. Display icons in dropdown instead.
export default function Value({
  value,
  onChange,
  filter,
  literalAllowed = true,
  creationTitle = "Add value",
}) {
  const { variables, identify, define, render } = useVariables()
  const map = (variable) => ({
    value: identify(variable.definition),
    title: variable.view,
    variable,
  })
  const customFilter = ({ variable }) => filter(variable)

  const trigger = !value ? (
    <Placeholder>{creationTitle}</Placeholder>
  ) : value.type === "literal" ? (
    <Snippet color="beige">{value.data}</Snippet>
  ) : (
    <Snippet color="blue">{render(value)}</Snippet>
  )

  return (
    <Toggle trigger={trigger}>
      {(close) => (
        <Autocomplete
          filter={customFilter}
          map={map}
          items={variables}
          placeholder="Search for ..."
          custom={literalAllowed}
          customSuggestion={(input) => `Use "${input}" as literal`}
          value={value && identify(value)}
          onChange={(value) => {
            onChange(value && define(value))
            close()
          }}
        />
      )}
    </Toggle>
  )
}
