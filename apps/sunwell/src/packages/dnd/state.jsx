import React, { createContext, useRef } from "react"

export const context = createContext({})

export const Provider = ({ children }) => {
  const ref = useRef({ transfer: {} })

  return (
    <context.Provider
      value={{
        start: type => {
          ref.current.type = type
        },
        reset: () => {
          ref.current = { transfer: {} }
        },
        registerDrop: leave => {
          const index = (ref.current.drops?.lastIndex || 0) + 1

          ref.current.drops = {
            lastIndex: index,
            current: {
              ...ref.current.drops?.current,
              [index]: { leave, over: true },
            },
          }

          return index
        },
        leaveDrops: () => {
          if (!ref.current.drops) return

          for (let drop of Object.values(ref.current.drops.current)) {
            drop.leave()
            drop.over = false
          }
        },
        enterDrops: () => {
          if (!ref.current.drops) return

          for (let drop of Object.values(ref.current.drops.current)) {
            drop.over = true
          }
        },
        isActiveDrop: index => {
          return ref.current.drops.current[index].over
        },
        provide: callbacks => {
          let result = {}

          for (let key of Object.keys(callbacks)) {
            const fn = callbacks[key]

            result[key] = action => {
              {
                const prev = ref.current.action
                ref.current.action = Object.assign({}, prev, action)
              }

              {
                if (!fn) return

                const prev = ref.current.transfer
                ref.current.transfer = Object.assign(
                  {},
                  prev,
                  fn(prev, ref.current.action)
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
