import React, { createContext, useRef } from "react"

export const context = createContext({})

export const Provider = ({ children }) => {
  const ref = useRef({})

  return (
    <context.Provider
      value={{
        dragStart: type => {
          ref.current.type = type
        },
        dragEnd: () => {
          ref.current = {}
        },
        provide: callbacks => {
          let result = {}

          for (let key of Object.keys(callbacks)) {
            const fn = callbacks[key]

            result[key] = internal => {
              {
                const prev = ref.current.internal
                ref.current.internal = Object.assign({}, prev, internal)
              }

              {
                if (!fn) return

                const prev = ref.current.external
                ref.current.external = Object.assign(
                  {},
                  prev,
                  fn(prev || {}, ref.current.internal)
                )
              }
            }
          }

          return result
        },
        type: () => ref.current.type,
      }}
    >
      {children}
    </context.Provider>
  )
}
