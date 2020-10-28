import React from "react"
import { Toggle } from "@sourceface/components"
import Placeholder from "../Placeholder"
import Snippet from "../Snippet"
import Autocomplete from "../Autocomplete"

export default ({ value, onChange, clearable, creationTitle, suggestions }) => {
  const trigger = !value ? (
    <Placeholder>{creationTitle}</Placeholder>
  ) : (
    <Snippet color="gray">{findTitle(suggestions, value)}</Snippet>
  )

  return (
    <Toggle trigger={trigger}>
      {(close) => (
        <Autocomplete
          items={suggestions}
          clearable={clearable}
          placeholder="Search for ..."
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

const findTitle = (suggestions, value) =>
  suggestions.find((s) => s.value === value).title
