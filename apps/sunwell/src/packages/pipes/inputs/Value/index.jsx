// TODO: either have blue(variable + type icon) or beige(literal) color
import React from "react"
import { Snippet } from "../../components"
import Pen from "assets/pen.svg"
import Parentheses from "assets/parentheses.svg"

export default function Value({ value }) {
  const literalView = { icon: <Pen />, color: "beige" }
  const variableView = { icon: <Parentheses />, color: "blue" }

  switch (value.type) {
    case "literal":
      return <Snippet {...literalView}>{value.data}</Snippet>

    case "local":
      return <Snippet {...variableView}>{value.name}</Snippet>
  }
}
