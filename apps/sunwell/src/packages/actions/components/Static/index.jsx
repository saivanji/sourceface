import React from "react"
import { Toggle, Autocomplete } from "@sourceface/components"
import Placeholder from "../Placeholder"
import Snippet from "../Snippet"

export default ({ value, onChange, creationTitle }) => {
  const trigger = !value ? (
    <Placeholder>{creationTitle}</Placeholder>
  ) : (
    <Snippet color="gray">{value}</Snippet>
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
