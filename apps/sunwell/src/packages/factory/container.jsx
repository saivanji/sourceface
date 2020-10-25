import React, { createContext, useContext } from "react"

const root = createContext({})

export default function Container({ children, modules, queries, pages }) {
  return <root.Provider value={{ modules, queries }}>{children}</root.Provider>
}

export const useContainer = () => {
  return useContext(root)
}

export const useTransition = () => {}
