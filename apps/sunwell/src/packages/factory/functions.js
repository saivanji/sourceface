import React, { createContext, useContext } from "react"
// import { useContainer } from "./container"
// import { useEditor } from "./editor"
// import { useStore } from "./store"

const context = createContext({})

export function Functions({ children, effects }) {
  // const { stock } = useContainer()
  // const { modules } = useEditor()
  // const { assignState, store } = useStore()

  return (
    <context.Provider value={{ modules: {}, effects }}>
      {children}
    </context.Provider>
  )
}

export const useFunctions = () => {
  return useContext(context)
}
