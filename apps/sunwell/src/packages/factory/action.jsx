import React, { createContext, useContext } from "react"
import { useContainer } from "./container"
import { useEditor } from "./editor"

const context = createContext({})

export function Action({ action, children }) {
  const { stock, queries } = useContainer()
  const { configureAction } = useEditor()

  const { Root, Cut } = stock.actions.dict[action.type]

  const props = {
    queries,
    fetchCommands: (search, limit, offset) => {
      // TODO: use raw urql function here without react bindings
    },
    config: action.config,
    onConfigChange: (key, value) => configureAction(action.id, key, value),
  }

  const root = <Root {...props} />
  const cut = <Cut {...props} />

  return (
    <context.Provider value={{ action }}>
      {children(root, cut)}
    </context.Provider>
  )
}

export const useAction = () => {
  return useContext(context)
}
