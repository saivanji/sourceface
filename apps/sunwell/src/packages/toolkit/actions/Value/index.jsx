import React from "react"
import { useVariables, useConfiguration } from "packages/factory"
import Static from "../Static"

// TODO: remove icons, have only colors for variable types/literals. Display icons in dropdown instead.
export default function Value({
  value,
  literalAllowed = true,
  creationTitle = "Add value",
  ...props
}) {
  const { identify, render } = useVariables(module.id)

  const editionTitle =
    value?.type === "literal" ? value.data : value && render(value)
  const snippetColor = value?.type === "literal" ? "beige" : value && "blue"

  return (
    <Static
      {...props}
      removable
      creationTitle={creationTitle}
      editionTitle={editionTitle}
      value={value && identify(value)}
      snippetColor={snippetColor}
      custom={literalAllowed}
    >
      <Value.Autocomplete />
    </Static>
  )
}

Value.Autocomplete = function ValueAutocomplete({
  filter,
  onChange,
  ...props
}) {
  const { module } = useConfiguration()
  const { variables, identify, define } = useVariables(module.id)
  const map = (variable) => ({
    value: identify(variable.definition),
    title: variable.view,
    variable,
  })
  const customFilter = filter && (({ variable }) => filter(variable))
  const change = (value) => {
    onChange(value && define(value))
  }

  return (
    <Static.Autocomplete
      {...props}
      filter={customFilter}
      map={map}
      items={variables}
      customSuggestion={(input) => `Use "${input}" as literal`}
      onChange={change}
    />
  )
}
