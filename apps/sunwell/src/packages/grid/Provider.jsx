import React, {
  createContext,
  useRef,
  useContext,
  useEffect,
  useCallback,
} from "react"
import { DndProvider } from "../dnd"

const context = createContext({ isWrapped: false })

export default ({ children }) => {
  const registered = useRef({})

  const register = useCallback(
    (fn, id) => {
      const key = id || Object.keys(registered.current).length

      registered.current[key] = fn

      return key
    },
    [registered]
  )

  const call = useCallback((id, ...args) => registered.current[id](...args), [
    registered,
  ])

  return (
    <>
      <context.Provider value={{ isWrapped: true, register, call }}>
        <DndProvider>{children}</DndProvider>
      </context.Provider>
      <div id="preview-container"></div>
    </>
  )
}

export const useWrapped = () => {
  const { isWrapped } = useContext(context)

  return isWrapped
}

export const useRegister = fn => {
  const { register } = useContext(context)

  const id = useRef(id?.current || (register && register(fn)))

  useEffect(() => {
    if (!register) return

    register(fn, id.current)
  }, [id, fn])

  return id.current
}

export const useCall = () => {
  const { call } = useContext(context)

  return call
}
