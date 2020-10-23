import React from "react"
import { Toggle, Autocomplete } from "@sourceface/components"
import Snippet from "../Snippet"
import Placeholder from "../Placeholder"

// TODO: do not have switch for literal/variable, adding literal will be implemented by displaying
// "Use 'something' as literal" option at the first position of dropdown.
// TODO: remove icons, have only colors for variable types/literals. Display icons in dropdown instead.
export default function Value({
  value,
  autoFocus,
  creationTitle = "Add value",
  onChange,
  onDestroy,
}) {
  const trigger = !value ? (
    <Placeholder>{creationTitle}</Placeholder>
  ) : value.type === "literal" ? (
    <Snippet color="beige">{value.data}</Snippet>
  ) : (
    <Snippet color="blue">{value.name}</Snippet>
  )

  return (
    <Toggle trigger={trigger}>
      {(close) => (
        <Autocomplete>
          <Autocomplete.Item>Test 1</Autocomplete.Item>
          <Autocomplete.Item>Test 2</Autocomplete.Item>
          <Autocomplete.Item>Test 3</Autocomplete.Item>
          <Autocomplete.Item>Test 4</Autocomplete.Item>
          <Autocomplete.Item>Test 5</Autocomplete.Item>
        </Autocomplete>
      )}
    </Toggle>
  )
}
