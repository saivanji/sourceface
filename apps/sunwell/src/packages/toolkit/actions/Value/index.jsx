import React from "react"
import { useVariables, useConfiguration } from "packages/factory"
import Static from "../Static"

// TODO: remove icons, have only colors for variable types/literals. Display icons in dropdown instead.
export default function Value({
  value,
  multiple,
  removable = true,
  literalAllowed = true,
  creationTitle = "Add value",
  ...props
}) {
  const { variables, identify, render } = useVariables(module.id)

  const editionTitle =
    value?.type === "literal"
      ? value.data
      : multiple
      ? multipleSnippet(value, render)
      : value && render(value)
  const snippetColor = value?.type === "literal" ? "beige" : value && "blue"

  return (
    <Static
      {...props}
      removable={removable}
      multiple={multiple}
      creationTitle={creationTitle}
      editionTitle={editionTitle}
      items={variables}
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
  const { identify, define } = useVariables(module.id)
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
      customSuggestion={(input) => `Use "${input}" as literal`}
      onChange={change}
    />
  )
}

const multipleSnippet = (value, render) =>
  value?.length === 1 ? render(value[0]) : `${value?.length || 0} items`
