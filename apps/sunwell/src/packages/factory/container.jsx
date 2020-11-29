import React, { createContext, useContext } from "react"
import { Editor } from "./editor"
import { Scope } from "./scope"
import { Functions } from "./functions"

const context = createContext({})

export function Container({ children, stock, page, effects }) {
  return (
    <context.Provider
      value={{
        stock,
      }}
    >
      <Editor page={page}>
        <Scope>
          <Functions effects={effects}>{children}</Functions>
        </Scope>
      </Editor>
    </context.Provider>
  )
}

export const useContainer = () => {
  return useContext(context)
}
