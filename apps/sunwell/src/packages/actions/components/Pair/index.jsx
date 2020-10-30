import React, { useState } from "react"
import { Autocomplete, Toggle } from "@sourceface/components"
import Placeholder from "../Placeholder"
import Value from "../Value"

export default ({ value: [key, definition] = [], onChange, keys }) => {
  const [selectedKey, setSelectedKey] = useState()

  if (!key && !definition) {
    const trigger = <Placeholder>Add key/value</Placeholder>

    return (
      <Toggle trigger={trigger}>
        {(close) =>
          !selectedKey ? (
            <Autocomplete
              items={keys}
              placeholder="Key"
              onChange={setSelectedKey}
            />
          ) : (
            <Value.Autocomplete
              placeholder="Value"
              onChange={(value) => {
                onChange([selectedKey, value])
                setSelectedKey(null)
                close()
              }}
            />
          )
        }
      </Toggle>
    )
  }

  return (
    <Value
      prefix={{ color: "gray", text: key }}
      value={definition}
      onChange={(value) => onChange([key, value])}
      placeholder="Value"
    />
  )
}
