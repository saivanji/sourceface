import React from "react"
import { Toggle, Autocomplete } from "@sourceface/components"
import Snippet from "../Snippet"

// TODO: use + [action] in combination with dropdown
// TODO: do not have switch for literal/variable, adding literal will be implemented by displaying
// "Use 'something' as literal" option at the first position of dropdown.
// TODO: Move "Snippet" code here. Accept "type" prop to understand if we should ask for static value or variable/literal.
// TODO: remove icons, have only colors for variable types/literals. Display icons in dropdown instead.
// TODO: use dropdown with similar appearance when adding a new action.
export default function Value({ autoFocus, value, onChange, onDestroy }) {
  const trigger = !value ? (
    <Placeholder>Add value</Placeholder>
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
