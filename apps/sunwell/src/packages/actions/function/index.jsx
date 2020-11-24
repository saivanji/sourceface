import React from "react"
import { Value } from "packages/toolkit"

export function Root() {
  return (
    <>
      <span>For</span>
      <Value multiple creationTitle="Choose variables" onChange={console.log} />
    </>
  )
}

export const serialize = (config, relations, evaluate) => {
  return []
}

export const execute = ({ effects }) => (route) => {
  console.log("exec")
}

export const settings = {
  effect: true,
}
