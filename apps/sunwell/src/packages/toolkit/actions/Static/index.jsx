import React from "react"
import { Autocomplete, Toggle } from "@sourceface/components"
import Placeholder from "../Placeholder"
import Snippet from "../Snippet"

export default ({
  value,
  map,
  onChange,
  creationTitle,
  editionTitle,
  suggestions,
}) => {
  const trigger = !value ? (
    <Placeholder>{creationTitle}</Placeholder>
  ) : (
    <Snippet color="gray">
      {typeof suggestions === "function"
        ? editionTitle
        : findTitle(suggestions, value)}
    </Snippet>
  )

  return (
    <Toggle trigger={trigger}>
      {(close) => (
        <Autocomplete
          items={suggestions}
          placeholder="Search for ..."
          value={value}
          map={map}
          onChange={(...args) => {
            onChange(...args)
            close()
          }}
        />
      )}
    </Toggle>
  )
}

const findTitle = (suggestions, value) =>
  suggestions.find((s) => s.value === value).title
