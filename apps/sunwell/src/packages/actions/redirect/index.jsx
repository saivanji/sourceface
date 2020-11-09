import React from "react"
import { Static } from "packages/toolkit"

// TODO: use actual page names instead of paths and provide params similar way we provide arguments to a function
export function Root({ config: { pageId }, onConfigChange }) {
  return (
    <>
      <span>Redirect to</span>
      <Static
        creationTitle="Choose page"
        clearable={false}
        value={pageId}
        onChange={(pageId) => onConfigChange("pageId", pageId)}
        suggestions={[]}
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
