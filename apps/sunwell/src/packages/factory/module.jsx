import React, { createContext, useContext } from "react"
import { useContainer } from "./container"
import { useScope } from "./scope"
import { useEditor } from "./editor"

const context = createContext({})

export function Module({ module, frame: Frame }) {
  const { stock } = useContainer()
  const { isEditing, configureModule } = useEditor()
  const { readState, scope } = useScope()

  const Component = stock.modules.dict[module.type].Root
  const state = readState(module.id)

  return (
    <context.Provider value={{ module }}>
      <Component
        config={module.config}
        state={state}
        scope={scope[module.id]}
        layouts={module.layouts}
        components={{ Frame }}
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
  const { module } = useModule()

  return (value) => assignState(module.id, key, value)
}
