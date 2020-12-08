import React, { createContext, useContext } from "react"
import { useContainer } from "./container"
import { useEditor } from "./editor"

const context = createContext({})

export function Action({ action, children }) {
  const { stock } = useContainer()
  const { configureAction, changeReference } = useEditor()

  const { Root, Cut } = stock.actions.dict[action.type]

  const props = {
    action,
    onReferenceChange: (type, key, data) =>
      changeReference(action.id, type, key, data),
    onConfigChange: (key, value) => configureAction(action.id, key, value),
  }

  const root = <Root {...props} />
  const cut = Cut && <Cut {...props} />

  return (
    <context.Provider value={props}>{children(root, cut)}</context.Provider>
  )
}

export const useAction = () => {
  return useContext(context)
}
