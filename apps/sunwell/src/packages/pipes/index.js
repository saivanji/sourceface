// TODO: rename to actions
import React from "react"
import * as actions from "./actions"
import { Link } from "./components"

export const Pipe = ({ value, onChange }) => {
  return (
    <Link>
      <actions.runQuery.View />
    </Link>
  )
}
