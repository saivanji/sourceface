import React, { createContext, useContext } from "react"
import { DndProvider, DndContext } from "react-dnd"
import { TouchBackend } from "react-dnd-touch-backend"
import Layer from "./Layer"

const context = createContext({ isWrapped: false })

export default function GrillProvider({ children }) {
  const { dragDropManager } = useContext(DndContext)
  const wrappedDnd = !!dragDropManager

  /**
   * Do not wrapping in DndProvider if it's already wrapped from above.
   */
  return (
    <context.Provider value={{ isWrapped: true }}>
      {!wrappedDnd ? (
        <DndProvider
          backend={TouchBackend}
          options={{ enableMouseEvents: true }}
        >
          {children}
          <Layer />
        </DndProvider>
      ) : (
        <>
          {children}
          <Layer />
        </>
      )}
    </context.Provider>
  )
}

export const useWrapped = function Wrapped() {
  const { isWrapped } = useContext(context)

  return isWrapped
}
