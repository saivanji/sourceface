import React from "react"

export default ({ config, e: Expression }) => {
  return <Expression input={config.value} />
}
