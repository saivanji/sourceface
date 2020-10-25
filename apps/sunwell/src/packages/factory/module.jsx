import React, { createContext, useContext } from "react"
import { useContainer } from "./container"

const context = createContext({})

export function Module({ module, isEditing, frame: Frame, onConfigChange }) {
  const { stock } = useContainer()

  const Component = stock.modules.dict[module.type].Root
  const { readState, modulesScope } = useContainer()
  const scope = modulesScope[module.id]
  const state = readState(module.id)

  return (
    <context.Provider value={module}>
      <Component
        config={module.config}
        state={state}
        scope={scope}
        layers={module.layers}
        components={{ Frame }}
        isEditing={isEditing}
        onConfigChange={onConfigChange}
      />
    </context.Provider>
  )
}

export const useModule = () => {
  return useContext(context)
}

export const useTransition = function StateTransition(key) {
  const { assignState } = useContainer()
  const { id } = useModule()

  return (value) => assignState(id, key, value)
}
