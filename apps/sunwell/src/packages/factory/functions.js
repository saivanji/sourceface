import React, { createContext, useContext } from "react"
import { mapObjIndexed } from "ramda"
import { useContainer } from "./container"
import { useEditor } from "./editor"
import { useStore } from "./store"

const context = createContext({})

export function Functions({ children, effects }) {
  const { stock } = useContainer()
  const { modules } = useEditor()
  const { assignState, store } = useStore()

  const modulesFunctions = createModuleFunctions(
    modules,
    stock,
    store,
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

const createModuleFunctions = (modules, stock, store, assignState) =>
  mapObjIndexed(({ id, type }) => {
    // TODO: make sure it's correct
    if (!store[id]) {
      return
    }

    const { data, state } = store[id]

    return (
      stock.modules.dict[type].createFunctions?.(data, state, (key, value) =>
        assignState(id, key, value)
      ) || {}
    )
  }, modules)
