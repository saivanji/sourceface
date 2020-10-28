import React from "react"
import { Toggle } from "@sourceface/components"
import { useVariables } from "../../hooks"
import Placeholder from "../Placeholder"
import Autocomplete from "../Autocomplete"

// TODO: have selection in Autocomplete component(with ability to clear) and filter out selected item from a list
export default ({
  value: [key, definition] = [],
  onChange,
  creationTitle,
  placeholders,
  keys,
}) => {
  const trigger =
    !key && !definition ? (
      <Placeholder>{creationTitle}</Placeholder>
    ) : (
      // TODO: display key and value with Static and Value components?
      "Value"
    )

  const { variables, identify, define } = useVariables()
  const map = ({ view, definition }) => ({
    value: identify(definition),
    title: view,
  })

  return (
    <Toggle trigger={trigger}>
      {(close) => (
        <Autocomplete
          items={[keys, variables]}
          map={[undefined, map]}
          placeholder={placeholders}
          custom
          customSuggestion={(input) => `Use "${input}" as literal`}
          value={[key, definition && identify(definition)]}
          onChange={([key, variableId]) => {
            onChange([key, define(variableId)])
            close()
          }}
        />
      )}
    </Toggle>
  )
}
