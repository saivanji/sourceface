import React from "react"
import * as actions from "./actions"
import { Action } from "./components"

export const Pipe = ({ value, onChange }) => {
  return (
    <Action type="query" name="list">
      <actions.query.View />
    </Action>
  )
}
