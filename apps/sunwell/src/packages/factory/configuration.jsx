import React, { createContext, useContext } from "react"
import { useContainer } from "./container"

const context = createContext({})

export function Configuration({ module, children }) {
  const { stock } = useContainer()
  const Component = stock.modules.dict[module.type].Configuration

  return (
    <context.Provider
      value={{
        module,
      }}
    >
      <Component config={module.config} />
      {children}
    </context.Provider>
  )
}

export const useConfiguration = () => {
  return useContext(context)
}
