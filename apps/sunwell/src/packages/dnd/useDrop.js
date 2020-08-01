import { useRef, useEffect, useContext } from "react"
import { context } from "./state"

export default (types, { onEnter, onLeave, onOver, onDrop }) => {
  const ref = useRef()
  const local = useRef()
  const { provide, type } = useContext(context)
  const lifecycle = provide({ onEnter, onLeave, onOver, onDrop })

  useEffect(() => {
    const listener = callback => e => {
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
        local.current = {
          isEntered: true,
        }

        lifecycle.onEnter(...args)

        return
      }

      lifecycle.onOver(...args)
    })

    ref.current.addEventListener("mousemove", mousemove)
    ref.current.addEventListener("mouseleave", mouseleave)
    ref.current.addEventListener("mouseup", mouseup)

    return () => {
      ref.current.removeEventListener("mousemove", mousemove)
      ref.current.removeEventListener("mouseleave", mouseleave)
      ref.current.removeEventListener("mouseup", mouseup)
    }
  }, [ref, type, types, onEnter, onLeave, onOver, onDrop])

  return ref
}
