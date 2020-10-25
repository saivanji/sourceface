import React from "react"
import { Action, Value } from "./components"

// TODO: use actual page names instead of paths and provide params similar way we provide arguments to a function
export function Root({ config }) {
  return (
    <Action>
      Redirect to
      <Value value={{ type: "literal", data: "/" }} />
    </Action>
  )
}

export const execute = (config, { queries, modules }) => {}

export const add = (config) => {}
