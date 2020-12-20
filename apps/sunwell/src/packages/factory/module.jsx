import React, { createContext, useContext } from "react"
import { useContainer } from "./container"
import { useStore } from "./store"
import { useEditor } from "./editor"
import { Mount } from "./mount"
import { useValues } from "./execution"

const moduleContext = createContext({})

function Component({ module }) {
  const { stock } = useContainer()
  const { isEditing, configureModule } = useEditor()
  const { store, scope, assignData } = useStore()

  const { Root, populate = [] } = stock.modules.dict[module.type]
  const moduleStore = store[module.id]

  const [, isUpdating, pristine, error] = useValues(...populate, (data) =>
    assignData(module.id, data)
  )

  // TODO: check of function availability as well in addition to variable availability

  return error ? (
    `Failed to load data:\n${JSON.stringify(error)}`
  ) : pristine || !moduleStore ? (
    "Loading..."
  ) : (
    <Mount moduleId={module.id}>
      <Root
        data={moduleStore.data}
        state={moduleStore.state}
        scope={scope[module.id]}
        isUpdating={isUpdating}
        isEditing={isEditing}
        onConfigChange={(key, value) => configureModule(module.id, key, value)}
      />
    </Mount>
  )
}

export function Module({ module }) {
  return (
    <moduleContext.Provider value={module}>
      <Component module={module} />
    </moduleContext.Provider>
  )
}

export const useModule = () => {
  return useContext(moduleContext)
}

export const useTransition = function StateTransition(key) {
  const { assignState } = useStore()
  const { id: moduleId } = useModule()

  return (value) => assignState(moduleId, key, value)
}
