import { useRef, useEffect, useContext } from "react"
import { context } from "./state"
// TODO: how to pass start, client and delta to drop callbacks?

export default (types, callbacks = {}) => {
  const ref = useRef()
  const { provide, type } = useContext(context)
  const { onEnter, onLeave, onOver, onDrop } = provide(callbacks)

  useEffect(() => {
    // TODO: how to make sure drop event fires always before drag end?
    // it might happen that drop event will fire last which will cause the loss of that event. Because we delete drag type on drag end.
    // Does browser fires mouse up for childs earlier than for the document?
    const listener = callback => e => {
      if (types.includes(type())) {
        callback && callback()
      }
    }

    const mousemove = listener(onOver)
    const mouseenter = listener(onEnter)
    const mouseleave = listener(onLeave)
    const mouseup = listener(onDrop)

    ref.current.addEventListener("mousemove", mousemove)
    ref.current.addEventListener("mouseenter", mouseenter)
    ref.current.addEventListener("mouseleave", mouseleave)
    ref.current.addEventListener("mouseup", mouseup)

    return () => {
      ref.current.removeEventListener("mousemove", mousemove)
      ref.current.removeEventListener("mouseenter", mouseenter)
      ref.current.removeEventListener("mouseleave", mouseleave)
      ref.current.removeEventListener("mouseup", mouseup)
    }
  }, [ref, type, types, onEnter, onLeave, onOver, onDrop])

  return ref
}
