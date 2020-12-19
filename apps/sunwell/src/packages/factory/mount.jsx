import React, { createContext, useContext } from "react"
// TODO: circular import?
import { useValues } from "./execution"

const context = createContext({})

export function Mount({ children, moduleId }) {
  const [[data], loading, pristine, error] = useValues("@mount")
  const parentMount = useMount()

  // TODO: where to put UI related code to loaders?
  // TODO: when pristine: true - display global loading
  // TODO: when loading: true - use Await

  // console.log(data, loading, pristine, error)

  return error ? (
    JSON.stringify(error)
  ) : pristine ? (
    "Loading..."
  ) : (
    <context.Provider value={{ ...parentMount, [moduleId]: data }}>
      {children}
    </context.Provider>
  )
}

export const useMount = () => {
  return useContext(context)
}
