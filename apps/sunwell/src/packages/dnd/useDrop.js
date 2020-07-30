import { useRef, useEffect, useContext } from "react"
import { context } from "./state"
// TODO: how to pass start, client and delta to drop callbacks?

export default (types, { onEnter, onLeave, onOver, onDrop }) => {
  const ref = useRef()
  const local = useRef()
  const { provide, type } = useContext(context)
  const lifecycle = provide({ onEnter, onLeave, onOver, onDrop })

  useEffect(() => {
    // TODO: how to make sure drop event fires always before drag end?
    // it might happen that drop event will fire last which will cause the loss of that event. Because we delete drag type on drag end.
    // Does browser fires mouse up for childs earlier than for the document?
    const listener = callback => e => {
      const t = type()
      if (types.includes(t)) {
        callback && callback({ type: t })
      }
    }

    const mouseup = listener(lifecycle.onDrop)
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
