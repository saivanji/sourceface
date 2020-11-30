import React, { createContext, useContext } from "react"
import { useContainer } from "./container"
import { useEditor } from "./editor"
import { useScope } from "./scope"

const context = createContext({})

export function Functions({ children, effects }) {
  const { stock } = useContainer()
  const { modules } = useEditor()
  const { assignState, scope } = useScope()

  const modulesFunctions = createModuleFunctions(
    modules,
    stock,
    scope,
    assignState
  )

  return (
    <context.Provider value={{ modules: modulesFunctions, effects }}>
      {children}
    </context.Provider>
  )
}

export const useFunctions = () => {
  return useContext(context)
}

const createModuleFunctions = (modules, stock, scope, assignState) =>
  modules.reduce(
    (acc, module) => ({
      ...acc,
      [module.id]:
        stock.modules.dict[module.type].createFunctions?.(
          module.config,
          scope.modules[module.id],
          (key, value) => assignState(module.id, key, value)
        ) || {},
    }),
    {}
  )
