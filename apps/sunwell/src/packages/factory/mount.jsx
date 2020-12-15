import React, { createContext, useContext } from "react"
// TODO: circular import?
import { useValue } from "./execution"

const context = createContext({})

export function Mount({ children, moduleId }) {
  const [[data], loading, pristine, error] = useValue("@mount")
  const parentMountScope = useMount()

  // TODO: where to put UI related code to loaders?
  // TODO: when pristine: true - display global loading
  // TODO: when loading: true - use Await

  // console.log(data, loading, pristine, error)

  return pristine ? (
    "Loading..."
  ) : (
    <context.Provider value={{ ...parentMountScope, [moduleId]: data }}>
      {children}
    </context.Provider>
  )
}

export const useMount = () => {
  return useContext(context)
}
