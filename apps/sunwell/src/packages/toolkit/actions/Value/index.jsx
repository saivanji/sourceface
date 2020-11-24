import React from "react"
import { useVariables, useConfiguration } from "packages/factory"
import Static from "../Static"

// TODO: remove icons, have only colors for variable types/literals. Display icons in dropdown instead.
export default function Value({
  value,
  multiple,
  literalAllowed = true,
  creationTitle = "Add value",
  ...props
}) {
  const { identify, render } = useVariables(module.id)

  const editionTitle =
    value?.type === "literal"
      ? value.data
      : multiple
      ? value?.map(render)
      : value && render(value)
  const snippetColor = value?.type === "literal" ? "beige" : value && "blue"

  return (
    <Static
      {...props}
      removable
      multiple={multiple}
      creationTitle={creationTitle}
      editionTitle={editionTitle}
      value={value && (multiple ? value.map(identify) : identify(value))}
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
  multiple,
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
    onChange(value && (multiple ? value.map(define) : define(value)))
  }

  return (
    <Static.Autocomplete
      {...props}
      multiple={multiple}
      filter={customFilter}
      map={map}
      items={variables}
      customSuggestion={(input) => `Use "${input}" as literal`}
      onChange={change}
    />
  )
}
