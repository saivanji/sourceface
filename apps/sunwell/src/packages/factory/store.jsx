import React, { createContext, useState, useContext } from "react"
import { assocPath } from "ramda"

const context = createContext({})

// TODO: have only modules state here, without scope since it will be calculated on demand
// probably rename Store to something more meaningful
export function Store({ children }) {
  const [state, setState] = useState({})

  function assignState(moduleId, key, value) {
    setState(assocPath([moduleId, key], value))
  }

  return (
    <context.Provider
      value={{
        state,
        assignState,
      }}
    >
      {children}
    </context.Provider>
  )
}

export const useStore = () => {
  return useContext(context)
}
