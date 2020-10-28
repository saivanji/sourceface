import React from "react"
import { Toggle } from "@sourceface/components"
import { useVariables } from "../../hooks"
import Snippet from "../Snippet"
import Placeholder from "../Placeholder"
import Autocomplete from "../Autocomplete"

// TODO: remove icons, have only colors for variable types/literals. Display icons in dropdown instead.
export default function Value({
  value,
  onChange,
  filter,
  literalAllowed = true,
  creationTitle = "Add value",
}) {
  const trigger = !value ? (
    <Placeholder>{creationTitle}</Placeholder>
  ) : value.type === "literal" ? (
    <Snippet color="beige">{value.data}</Snippet>
  ) : (
    <Snippet color="blue">{value.name}</Snippet>
  )
  const { variables, identify, define } = useVariables()
  const map = (variable) => ({
    value: identify(variable.definition),
    title: variable.view,
    variable,
  })
  const customFilter = ({ variable }) => filter(variable)

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
            onChange(define(value))
            close()
          }}
        />
      )}
    </Toggle>
  )
}
