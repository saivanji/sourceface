import React, { createContext, useContext } from "react"
import { useMutation, mutations } from "packages/client"
import { useContainer } from "./container"
import { useScope } from "./scope"

const context = createContext({})

export function Module({ module, isEditing, frame: Frame }) {
  const [, configureModule] = useMutation(mutations.configureModule)
  const { stock } = useContainer()
  const { readState, modulesScope } = useScope()

  const Component = stock.modules.dict[module.type].Root
  const scope = modulesScope[module.id]
  const state = readState(module.id)

  const changeConfig = async (key, value) =>
    configureModule({ moduleId: module.id, key, value })

  return (
    <context.Provider value={module}>
      <Component
        config={module.config}
        state={state}
        scope={scope}
        layouts={module.layouts}
        components={{ Frame }}
        isEditing={isEditing}
        onConfigChange={changeConfig}
      />
    </context.Provider>
  )
}

export const useModule = () => {
  return useContext(context)
}

export const useTransition = function StateTransition(key) {
  const { assignState } = useScope()
  const { id } = useModule()

  return (value) => assignState(id, key, value)
}
