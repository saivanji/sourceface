// Since that state and local module state have nothing in common, distinct them between each other. By naming them differently?
import React, { createContext, useState, useContext } from "react"

const context = createContext({})

export function State({ children }) {
  const [state, setState] = useState({})

  function readState(key) {
    return state[key]
  }

  function assignState(key, value) {
    setState({
      ...state,
      [key]: value,
    })
  }

  return (
    <context.Provider value={{ readState, assignState }}>
      {children}
    </context.Provider>
  )
}

export const useGlobalState = () => {
  return useContext(context)
}
