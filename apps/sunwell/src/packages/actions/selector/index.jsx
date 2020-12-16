import React from "react"
import { update, path } from "ramda"
import { Value, Static } from "packages/toolkit"

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
  // TODO: do we need to return variable or access path inside of "serialize"?
  return [definition && createVariable(definition), path]
}

// TODO: do we need to use "runtime"?
export const execute = ({ runtime }) => (variable, keys = []) =>
  variable && path(keys, variable.get(runtime))

// Select [foo][bar][baz] from [variable]
const suggestions = [
  "customer_name",
  "address",
  "delivery_type",
  "status",
  "payment_type",
  "currency",
  "amount",
].map((key) => ({ title: key, value: key }))
