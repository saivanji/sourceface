import React from "react"
import { Value } from "packages/toolkit"

// TODO: use actual page names instead of paths and provide params similar way we provide arguments to a function
export function Root({ config }) {
  return (
    <>
      Redirect to
      <Value value={{ type: "literal", data: "/" }} />
    </>
  )
}

export const execute = ({ queries }) => () => {
  console.log("works")
}

export const add = (config) => {}
