import React from "react"
import {
  useScope,
  useEditor,
  useConfiguration,
  renderVariable,
  identifyVariable,
  defineVariable,
  createVariables,
} from "packages/factory"
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
  const { modules } = useEditor()
  const { module } = useConfiguration()
  const { scope } = useScope()

  const editionTitle =
    value?.type === "literal"
      ? value.data
      : multiple
      ? multipleSnippet(value, modules)
      : value && renderVariable(value, modules)
  const snippetColor = value?.type === "literal" ? "beige" : value && "blue"
  const variables = createVariables(module.id, null, scope, modules)

  return (
    <Static
      {...props}
      removable={removable}
      multiple={multiple}
      creationTitle={creationTitle}
      editionTitle={editionTitle}
      items={variables}
      value={
        value &&
        (multiple ? value.map(identifyVariable) : identifyVariable(value))
      }
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
  const map = (variable) => ({
    value: identifyVariable(variable.definition),
    title: variable.view,
    variable,
  })
  const customFilter = filter && (({ variable }) => filter(variable))
  const change = (value) => {
    onChange(
      value && (multiple ? value.map(defineVariable) : defineVariable(value))
    )
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

const multipleSnippet = (value, modules) =>
  value?.length === 1
    ? renderVariable(value[0], modules)
    : `${value?.length || 0} items`
