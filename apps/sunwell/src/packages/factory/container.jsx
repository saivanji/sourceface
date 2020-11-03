import React, { createContext, useContext } from "react"
import { Editor } from "./editor"
import { Scope } from "./scope"

const context = createContext({})

export function Container({
  children,
  stock,
  queries,
  page,
  effects,
  // pages,
}) {
  return (
    <context.Provider
      value={{
        stock,
        queries,
        effects,
      }}
    >
      <Editor page={page}>
        <Scope>{children}</Scope>
      </Editor>
    </context.Provider>
  )
}

export const useContainer = () => {
  return useContext(context)
}
