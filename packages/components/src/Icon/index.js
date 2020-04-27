import React from "react"

export default ({ name, size = "sm", color = "gray-shade-40" }) => (
  <i className={`material-icons text-${size} text-${color}`}>{name}</i>
)
