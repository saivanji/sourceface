import React, { createContext, useContext } from "react"
import { useMutation, mutations } from "packages/client"
import { useContainer } from "./container"

const context = createContext({})

export function Module({ module, isEditing, frame: Frame }) {
  const [, updateModule] = useMutation(mutations.updateModule)
  const { stock } = useContainer()

  const Component = stock.modules.dict[module.type].Root
  const { readState, modulesScope } = useContainer()
  const scope = modulesScope[module.id]
  const state = readState(module.id)

  // TODO: implement debouncing
  const changeConfig = async (key, value) =>
    updateModule({ moduleId: module.id, key, value })

  return (
    <context.Provider value={module}>
      <Component
        config={module.config}
        state={state}
        scope={scope}
        layers={module.layers}
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
  const { assignState } = useContainer()
  const { id } = useModule()

  return (value) => assignState(id, key, value)
}
