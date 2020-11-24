import React, { useState } from "react"
import Value from "../Value"
import Static from "../Static"

export default ({ value: [key, definition] = [], onChange, keys }) => {
  const [selectedKey, setSelectedKey] = useState()

  const reset = () => setSelectedKey(null)

  if (!key && !definition) {
    return (
      <Static
        shouldClose={!!selectedKey}
        creationTitle="Add key/value"
        items={!selectedKey && keys}
        placeholder={!selectedKey ? "Key" : "Value"}
        onClose={reset}
        onChange={(x) => {
          if (!selectedKey) {
            setSelectedKey(x)
            return
          }

          onChange([selectedKey, x])
          reset()
        }}
      >
        {!selectedKey ? <Static.Autocomplete /> : <Value.Autocomplete />}
      </Static>
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
