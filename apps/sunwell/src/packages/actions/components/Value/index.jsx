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
  prefix,
  placeholder = "Search for ...",
  literalAllowed = true,
  creationTitle = "Add value",
}) {
  const { render } = useVariables()

  const remove = () => onChange(null)

  const trigger = !value ? (
    <Placeholder>{creationTitle}</Placeholder>
  ) : value.type === "literal" ? (
    <Snippet prefix={prefix} color="beige" removable onRemove={remove}>
      {value.data}
    </Snippet>
  ) : (
    <Snippet prefix={prefix} color="blue" removable onRemove={remove}>
      {render(value)}
    </Snippet>
  )

  return (
    <Toggle trigger={trigger}>
      {(close) => (
        <Value.Autocomplete
          filter={filter}
          placeholder={placeholder}
          literalAllowed={literalAllowed}
          value={value}
          onChange={(value) => {
            onChange(value)
            close()
          }}
        />
      )}
    </Toggle>
  )
}

Value.Autocomplete = function ValueAutocomplete({
  filter,
  placeholder,
  literalAllowed,
  value,
  onChange,
}) {
  const { variables, identify, define } = useVariables()
  const map = (variable) => ({
    value: identify(variable.definition),
    title: variable.view,
    variable,
  })
  const customFilter = filter && (({ variable }) => filter(variable))

  return (
    <Autocomplete
      filter={customFilter}
      map={map}
      items={variables}
      placeholder={placeholder}
      custom={literalAllowed}
      customSuggestion={(input) => `Use "${input}" as literal`}
      value={value && identify(value)}
      onChange={(value) => {
        onChange(value && define(value))
      }}
    />
  )
}
