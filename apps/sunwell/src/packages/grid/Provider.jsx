import React, { createContext } from "react"
import { DndProvider } from "../dnd"

export const context = createContext(false)

export default ({ children }) => {
  return (
    <context.Provider value={true}>
      <DndProvider>{children}</DndProvider>
    </context.Provider>
  )
}
