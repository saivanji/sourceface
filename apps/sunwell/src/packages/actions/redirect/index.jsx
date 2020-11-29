import React from "react"
import { Relation } from "packages/toolkit"

const FIELD = "current"
const RELATION_TYPE = "pages"

// TODO: use actual page names instead of paths and provide params similar way we provide arguments to a function
export function Root() {
  return (
    <>
      <span>Redirect to</span>
      <Relation
        type={RELATION_TYPE}
        field={FIELD}
        titleField="title"
        creationTitle="Choose page"
      />
    </>
  )
}

export const serialize = (config, relations, evaluate) => {
  const page = relations[RELATION_TYPE]?.[FIELD]

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
}
