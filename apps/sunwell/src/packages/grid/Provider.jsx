import React, { createContext, useContext } from "react"
import { DndProvider } from "react-dnd"
import { TouchBackend } from "react-dnd-touch-backend"
import Layer from "./Layer"

const context = createContext({ isWrapped: false })

export default ({ children }) => {
  return (
    <context.Provider value={{ isWrapped: true }}>
      <DndProvider backend={TouchBackend} options={{ enableMouseEvents: true }}>
        {children}
        <Layer />
      </DndProvider>
    </context.Provider>
  )
}

export const useWrapped = () => {
  const { isWrapped } = useContext(context)

  return isWrapped
}
