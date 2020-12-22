import React, { createContext, useContext } from "react"
import { useContainer } from "./container"
import { useStore } from "./store"
import { useEditor } from "./editor"
import { Mount } from "./mount"
import { useValues } from "./option"
import { useScope } from "./scope"

const moduleContext = createContext({})

function Component({ module }) {
  const { stock } = useContainer()
  const { isEditing } = useEditor()
  const { state } = useStore()

  const { Root } = stock.modules.dict[module.type]

  // TODO: check of function availability as well in addition to variable availability

  const [data, dataMeta] = useValues(...(Root.data || []))
  const [scope, scopeMeta] = useScope(...(Root.scope || []))

  const error = dataMeta.error || scopeMeta.error
  const isPristine = dataMeta.isPristine || scopeMeta.isPristine
  const isUpdating = dataMeta.isLoading || scopeMeta.isLoading

  return error ? (
    `Failed to load data:\n${JSON.stringify(error)}`
  ) : isPristine ? (
    "Loading..."
  ) : (
    <Mount moduleId={module.id}>
      <Root
        data={data}
        scope={scope}
        state={state[module.id]}
        isUpdating={isUpdating}
        isEditing={isEditing}
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
