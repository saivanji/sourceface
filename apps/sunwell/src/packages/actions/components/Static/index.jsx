import React from "react"
import { Toggle, Autocomplete } from "@sourceface/components"
import Placeholder from "../Placeholder"
import Snippet from "../Snippet"

export default ({ value, onChange, creationTitle, suggestions = [] }) => {
  const trigger = !value ? (
    <Placeholder>{creationTitle}</Placeholder>
  ) : (
    <Snippet color="gray">{value}</Snippet>
  )

  return (
    <Toggle trigger={trigger}>
      {(close) => (
        <Autocomplete>
          {suggestions.map((item, i) => (
            <Autocomplete.Item
              key={i}
              onClick={() => {
                onChange(item.data)
                close()
              }}
            >
              {item.title}
            </Autocomplete.Item>
          ))}
        </Autocomplete>
      )}
    </Toggle>
  )
}
