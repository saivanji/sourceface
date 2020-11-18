import React from "react"
import { Static } from "packages/toolkit"

const KEY = "current"
const RELATION_TYPE = "pages"

// TODO: use actual page names instead of paths and provide params similar way we provide arguments to a function
export function Root({ listAll, relations, onRelationChange }) {
  const page = relations[RELATION_TYPE]?.[KEY]

  const suggestions = (search, page) =>
    listAll(RELATION_TYPE, { search, limit: 10, offset: page * 10 })

  const map = (page) => ({
    value: page.id,
    title: page.title,
  })

  return (
    <>
      <span>Redirect to</span>
      <Static
        map={map}
        clearable={false}
        creationTitle="Choose page"
        editionTitle={page?.title}
        value={page?.id}
        onChange={(_, page) => onRelationChange(RELATION_TYPE, KEY, page)}
        suggestions={suggestions}
      />
    </>
  )
}

export const serialize = (config, evaluate) => {
  return []
}

export const execute = ({ queries }) => () => {
  console.log("works")
}

export const settings = {
  effect: true,
}
