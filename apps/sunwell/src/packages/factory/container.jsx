import React, { createContext, useContext } from "react"
import { Editor } from "./editor"
import { Scope } from "./scope"
import { State } from "./state"
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
          <State>
            <Functions effects={effects}>{children}</Functions>
          </State>
        </Scope>
      </Editor>
    </context.Provider>
  )
}

export const useContainer = () => {
  return useContext(context)
}
