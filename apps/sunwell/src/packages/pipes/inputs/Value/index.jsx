// TODO: either have blue(variable + type icon) or beige(literal) color
import React from "react"
import { Snippet } from "../../components"
import Pen from "assets/pen.svg"
import Parentheses from "assets/parentheses.svg"

export default function Value({ autoFocus, value, onChange }) {
  const literalView = { icon: <Pen />, color: "beige" }
  const variableView = { icon: <Parentheses />, color: "blue" }

  switch (value.type) {
    case "literal":
      return (
        <Snippet
          {...literalView}
          autoFocus={autoFocus}
          value={value.data}
          onChange={(data) => onChange({ ...value, data })}
        />
      )

    case "local":
      return (
        <Snippet
          {...variableView}
          autoFocus={autoFocus}
          value={value.name}
          onChange={(name) => onChange({ ...value, name })}
        />
      )
  }
}
