import { useRef, useEffect, useContext } from "react"
import { context } from "./state"

export default (types, { onEnter, onLeave, onOver, onDrop }) => {
  const target = useRef()
  const local = useRef({})
  const { provide, type } = useContext(context)
  const lifecycle = provide({ onEnter, onLeave, onOver, onDrop })

  useEffect(() => {
    const listener = callback => () => {
      const t = type()
      if (types.includes(t)) {
        callback && callback({ type: t })
      }
    }

    const mouseup = listener((...args) => {
      local.current.isEntered = false
      lifecycle.onDrop(...args)
    })
    const mouseleave = listener((...args) => {
      local.current.isEntered = false
      lifecycle.onLeave(...args)
    })

    const mousemove = listener((...args) => {
      if (!local.current?.isEntered) {
        local.current.isEntered = true

        lifecycle.onEnter(...args)

        return
      }

      lifecycle.onOver(...args)
    })

    target.current.addEventListener("mousemove", mousemove)
    target.current.addEventListener("mouseleave", mouseleave)
    target.current.addEventListener("mouseup", mouseup)

    return () => {
      target.current.removeEventListener("mousemove", mousemove)
      target.current.removeEventListener("mouseleave", mouseleave)
      target.current.removeEventListener("mouseup", mouseup)
    }
  }, [target, type, types, onEnter, onLeave, onOver, onDrop])

  return target
}
