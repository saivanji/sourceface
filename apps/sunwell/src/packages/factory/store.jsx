import React, { createContext, useState, useContext } from "react"
import { mapObjIndexed, zipObj, assocPath, mergeRight } from "ramda"
import { useContainer } from "./container"
import { useEditor } from "./editor"

const context = createContext({})

export function Store({ children }) {
  const { stock } = useContainer()
  const { modules } = useEditor()
  const [store, setStore] = useState({})

  function assignState(moduleId, key, value) {
    setStore(assocPath([moduleId, "state", key], value))
  }

  function assignData(moduleId, values) {
    const { type } = modules[moduleId]
    const { populate } = stock.modules.dict[type]

    setStore(assocPath([moduleId, "data"], zipObj(populate, values)))
  }

  const scope = createScope(store, stock, modules)

  return (
    <context.Provider
      value={{
        scope,
        store,
        assignState,
        assignData,
      }}
    >
      {children}
    </context.Provider>
  )
}

// TODO: check on variable availability here?
const createScope = (store, stock, modules) =>
  mapObjIndexed(({ data, state }, moduleId) => {
    const { createScope, initialState } = stock.modules.dict[
      modules[moduleId].type
    ]

    return createScope?.(data, mergeRight(initialState, state))
  }, store)

export const useStore = () => {
  return useContext(context)
}
