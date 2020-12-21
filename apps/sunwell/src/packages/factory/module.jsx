import React, { createContext, useContext } from "react"
import { useContainer } from "./container"
import { useStore } from "./store"
import { useEditor } from "./editor"
import { Mount } from "./mount"
import { useValues } from "./execution"
import { useScope } from "./scope"

const moduleContext = createContext({})

function Component({ module }) {
  const { stock } = useContainer()
  const { isEditing, configureModule } = useEditor()
  const { state } = useStore()

  const { Root, populateData = [], populateScope = [] } = stock.modules.dict[
    module.type
  ]

  const [data, isUpdating, pristine, error] = useValues(...populateData)

  // TODO: check of function availability as well in addition to variable availability

  const [scope, scopeMeta] = useScope(...populateScope)

  return error ? (
    `Failed to load data:\n${JSON.stringify(error)}`
  ) : pristine ? (
    "Loading..."
  ) : (
    <Mount moduleId={module.id}>
      <Root
        data={data}
        scope={scope}
        state={state[module.id]}
        isUpdating={isUpdating || scopeMeta.isUpdating}
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
