import React from "react"
import { update, path } from "ramda"
import { Value, Static } from "packages/toolkit"

// TODO: sometimes it's useful to return variable value from the action (without accessing it's fields). Cover that case here.
// rename to "Variable/Value" so user can return plain value from the action or access it's fields.
// Or implement field accessing api in Value autocomplete so properties can be accessed in any place Value can be used?
export function Root({ action, onConfigChange }) {
  const { definition, path = [] } = action.config

  const change = (i) => (key) =>
    onConfigChange("path", !key ? path.slice(0, i) : update(i, key, path))

  const add = (key) => onConfigChange("path", [...path, key])

  const setDefinition = (definition) => onConfigChange("definition", definition)

  return (
    <>
      <span>In</span>
      <Value value={definition} onChange={setDefinition} />
      {definition && (
        <>
          <span>select</span>
          {path.map((key, i) => (
            <Static
              key={i}
              removable
              value={key}
              editionTitle={key}
              items={suggestions}
              onChange={change(i)}
            />
          ))}
          <Static items={suggestions} creationTitle="Add" onChange={add} />
        </>
      )}
    </>
  )
}

export const serialize = ({ definition, path }, action, { createVariable }) => {
  return [definition && createVariable(definition), path]
}

export const execute = ({ runtime }) => (variable, keys = []) =>
  variable && path(keys, variable.get(runtime))

const suggestions = [
  "customer_name",
  "address",
  "delivery_type",
  "status",
  "payment_type",
  "currency",
  "amount",
].map((key) => ({ title: key, value: key }))
