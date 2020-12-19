import React, { createContext, useContext } from "react"
import { Editor } from "./editor"
import { Store } from "./store"
import { State } from "./state"
import { Functions } from "./functions"

const context = createContext({})

export function Container({ children, stock, page, effects }) {
  return (
    <context.Provider
      value={{
        page,
        stock,
      }}
    >
      <Editor page={page}>
        <Store>
          <State>
            <Functions effects={effects}>{children}</Functions>
          </State>
        </Store>
      </Editor>
    </context.Provider>
  )
}

export const useContainer = () => {
  return useContext(context)
}
