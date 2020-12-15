import React, { createContext, useContext } from "react"
import { useContainer } from "./container"
import { useScope } from "./scope"
import { useEditor } from "./editor"
import { Mount } from "./mount"

const moduleContext = createContext({})

export function Module({ module }) {
  const { stock } = useContainer()
  const { isEditing, configureModule } = useEditor()
  const { readState, scope } = useScope()

  const Component = stock.modules.dict[module.type].Root
  const state = readState(module.id)

  return (
    <moduleContext.Provider value={module}>
      <Mount moduleId={module.id}>
        <Component
          config={module.config}
          state={state}
          scope={scope.modules[module.id]}
          isEditing={isEditing}
          onConfigChange={(key, value) =>
            configureModule(module.id, key, value)
          }
        />
      </Mount>
    </moduleContext.Provider>
  )
}

export const useModule = () => {
  return useContext(moduleContext)
}

export const useTransition = function StateTransition(key) {
  const { assignState } = useScope()
  const { id: moduleId } = useModule()

  return (value) => assignState(moduleId, key, value)
}
