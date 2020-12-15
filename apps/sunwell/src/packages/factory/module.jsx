import React, { createContext, useContext } from "react"
import { useContainer } from "./container"
import { useScope } from "./scope"
import { useEditor } from "./editor"
// TODO: circular import?
import { useValue } from "./execution"

const moduleContext = createContext({})
const mountContext = createContext({})

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

function Mount({ children, moduleId }) {
  const [[data], loading, pristine, error] = useValue("@mount")
  const parentMountScope = useMount()

  // TODO: where to put UI related code to loaders?
  // TODO: when pristine: true - display global loading
  // TODO: when loading: true - use Await

  console.log(data, loading, pristine, error)

  return pristine ? (
    "Loading..."
  ) : (
    <mountContext.Provider value={{ ...parentMountScope, [moduleId]: data }}>
      {children}
    </mountContext.Provider>
  )
}

export const useModule = () => {
  return useContext(moduleContext)
}

export const useMount = () => {
  return useContext(mountContext)
}

export const useTransition = function StateTransition(key) {
  const { assignState } = useScope()
  const { id: moduleId } = useModule()

  return (value) => assignState(moduleId, key, value)
}
