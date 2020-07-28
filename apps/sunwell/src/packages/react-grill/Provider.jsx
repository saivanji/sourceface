import React, { createContext } from "react"
import { ShiftedProvider } from "../react-shifted"

export const context = createContext(false)

export default ({ children }) => {
  return (
    <context.Provider value={true}>
      <ShiftedProvider>{children}</ShiftedProvider>
    </context.Provider>
  )
}
