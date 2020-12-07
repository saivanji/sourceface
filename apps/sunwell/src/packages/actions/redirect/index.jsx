import React from "react"
import { Reference } from "packages/toolkit"
import { getReference } from "packages/factory"

const FIELD = "current"
const REFERENCE_TYPE = "pages"

// TODO: use actual page names instead of paths and provide params similar way we provide arguments to a function
export function Root() {
  return (
    <>
      <span>Redirect to</span>
      <Reference
        type={REFERENCE_TYPE}
        field={FIELD}
        titleKey="title"
        creationTitle="Choose page"
      />
    </>
  )
}

export const serialize = (config, references) => {
  const page = getReference(REFERENCE_TYPE, FIELD, references)

  return [page?.route]
}

export const execute = ({ functions }) => (route) => {
  if (route) {
    // TODO: keep in mind params replacement
    functions.effects.navigate(route)
  }
}

export const settings = {
  effect: true,
  nameless: true,
}
