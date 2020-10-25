// TODO: have identifier and context here
import React, { createContext, useContext } from "react"
import * as modules from "./modules"

const context = createContext({})

export default function Module({
  module,
  isEditing,
  frame: Frame,
  onConfigChange,
}) {
  return <div />

  const Component = modules.dict[module.type].Root
  const { readState, getScope } = useContainer()
  // TODO: getLocalScope
  const scope = getScope(module.id)
  const state = readState(module.id)

  return (
    <Component
      config={module.config}
      state={state}
      local={scope.local}
      layers={module.layers}
      components={{ Frame }}
      isEditing={isEditing}
      onConfigChange={onConfigChange}
    />
  )
}

export const useModule = () => {}
