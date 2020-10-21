import React from "react"
import { Action, Value } from "../components"

export function View({ definition }) {
  return (
    <Action>
      Redirect to
      <Value value={{ type: "literal", data: "/" }} />
    </Action>
  )
}

export const execute = (definition, { queries, modules }) => {}

export const add = (definition) => {}
