import React, { createContext, useContext } from "react"
import { mapObjIndexed } from "ramda"
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
  mapObjIndexed(
    ({ id, type, config }) =>
      stock.modules.dict[type].createFunctions?.(
        config,
        scope.modules[id],
        (key, value) => assignState(id, key, value)
      ) || {},
    modules
  )
