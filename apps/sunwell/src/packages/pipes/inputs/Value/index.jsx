// TODO: either have blue(variable + type icon) or beige(literal) color
import React from "react"
import { Snippet } from "../../components"
import Pen from "assets/pen.svg"

export default function Value({ type, data }) {
  if (type === "literal") {
    return (
      <Snippet icon={<Pen />} color="beige">
        {data}
      </Snippet>
    )
  }

  return <Snippet></Snippet>
}
