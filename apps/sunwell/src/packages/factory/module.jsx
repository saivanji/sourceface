import React, { createContext, useContext } from "react"
import { useContainer } from "./container"
import { useScope } from "./scope"
import { useEditor } from "./editor"
import { Mount } from "./mount"
import { useValues } from "./execution"

const moduleContext = createContext({})

function Component({ module }) {
  const { stock } = useContainer()
  const { isEditing, configureModule } = useEditor()
  const { readState, scope } = useScope()

  const { Root, populate = [] } = stock.modules.dict[module.type]
  const state = readState(module.id)

  const [values, isUpdating, pristine, error] = useValues(...populate)

  return error ? (
    `Failed to load data:\n${JSON.stringify(error)}`
  ) : pristine ? (
    "Loading..."
  ) : (
    <Mount moduleId={module.id}>
      <Root
        values={transformValues(values, populate)}
        config={module.config}
        state={state}
        scope={scope.modules[module.id]}
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
  const { assignState } = useScope()
  const { id: moduleId } = useModule()

  return (value) => assignState(moduleId, key, value)
}

const transformValues = (values, populate) =>
  populate.reduce((acc, key, i) => ({ ...acc, [key]: values[i] }), {})
