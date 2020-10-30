import React from "react"
import { Toggle } from "@sourceface/components"
import { useVariables } from "../../hooks"
import Placeholder from "../Placeholder"
import styles from "./index.scss"
import Autocomplete from "../Autocomplete"

// TODO: consider having "x" icon on hover of Pair or Snippet to delete it
export default ({ value: [key, definition] = [], onChange, keys }) => {
  const placeholders = ["Key", "Value"]
  const { variables, identify, define, render } = useVariables()
  const map = ({ view, definition }) => ({
    value: identify(definition),
    title: view,
  })

  if (!key && !definition) {
    const trigger = <Placeholder>Add key/value</Placeholder>

    return (
      <Toggle trigger={trigger}>
        {(close) => (
          <Autocomplete.Stack
            onChange={(value) => {
              console.log(value)
              close()
            }}
          >
            <Autocomplete items={keys} placeholder="Key" />
            <Autocomplete items={keys} placeholder="Key" />
            <Autocomplete items={keys} placeholder="Key" />
            <Autocomplete items={keys} placeholder="Key" />
            <Autocomplete items={keys} placeholder="Key" />
            <Autocomplete
              items={variables}
              map={map}
              placeholder="Value"
              custom
              customSuggestion={(input) => `Use "${input}" as literal`}
            />
          </Autocomplete.Stack>
        )}
      </Toggle>
    )
  }

  return <div />

  const trigger = (
    <div className={styles.data}>
      <span className={styles.key}>{key}</span>
      <span className={styles.definition}>{render(definition)}</span>
    </div>
  )

  return (
    <Toggle trigger={trigger}>
      {(close) => (
        <Autocomplete
          items={variables}
          map={map}
          placeholder={placeholders[1]}
          custom
          customSuggestion={(input) => `Use "${input}" as literal`}
          value={identify(definition)}
          onChange={(variableId) => {
            onChange(variableId && [key, define(variableId)])
            close()
          }}
        />
      )}
    </Toggle>
  )
}
