// TODO: either have blue(variable + type icon) or beige(literal) color
import React from "react"
import { Snippet } from "../../components"
import Pen from "assets/pen.svg"
import Parentheses from "assets/parentheses.svg"

export default function Value({ autoFocus, value, onChange, onDestroy }) {
  const literalView = { icon: <Pen />, color: "beige" }
  const variableView = { icon: <Parentheses />, color: "blue" }

  switch (value.type) {
    case "literal":
      return (
        <Snippet
          {...literalView}
          autoFocus={autoFocus}
          value={value.data}
          onChange={(data) => onChange && onChange({ ...value, data })}
          onDestroy={onDestroy}
        />
      )

    case "local":
      return (
        <Snippet
          {...variableView}
          autoFocus={autoFocus}
          value={value.name}
          onChange={(name) => onChange && onChange({ ...value, name })}
          onDestroy={onDestroy}
        />
      )
  }
}
