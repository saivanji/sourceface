import React, { createContext, useContext } from "react"
import { useContainer } from "./container"
import { useScope } from "./scope"
import { useEditor } from "./editor"

const context = createContext({})

export function Module({ module }) {
  const { stock } = useContainer()
  const { isEditing, configureModule } = useEditor()
  const { readState, scope } = useScope()

  const Component = stock.modules.dict[module.type].Root
  const state = readState(module.id)

  return (
    <context.Provider value={module}>
      <Component
        config={module.config}
        state={state}
        scope={scope.modules[module.id]}
        isEditing={isEditing}
        onConfigChange={(key, value) => configureModule(module.id, key, value)}
      />
    </context.Provider>
  )
}

export const useModule = () => {
  return useContext(context)
}

export const useTransition = function StateTransition(key) {
  const { assignState } = useScope()
  const { id: moduleId } = useModule()

  return (value) => assignState(moduleId, key, value)
}
