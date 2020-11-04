import React, { createContext, useContext } from "react"
import { useContainer } from "./container"
import { useEditor } from "./editor"

const context = createContext({})

export function Action({ action }) {
  const { stock, queries } = useContainer()
  const { configureAction } = useEditor()

  const Component = stock.actions.dict[action.type].Root

  return (
    <context.Provider value={action}>
      <Component
        queries={queries}
        config={action.config}
        onConfigChange={(key, value) => configureAction(action.id, key, value)}
      />
    </context.Provider>
  )
}

export const useAction = () => {
  return useContext(context)
}
