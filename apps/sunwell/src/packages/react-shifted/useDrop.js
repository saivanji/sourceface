import { useRef, useEffect, useContext } from "react"
import { context } from "./state"
// TODO: how to pass start, client and delta to drop callbacks?

export default (types, callbacks = {}) => {
  const ref = useRef()
  const { provide, type } = useContext(context)
  const { onEnter, onLeave, onOver, onDrop } = provide(callbacks)

  useEffect(() => {
    const target = ref.current

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

    target.addEventListener("mousemove", mousemove)
    target.addEventListener("mouseenter", mouseenter)
    target.addEventListener("mouseleave", mouseleave)
    target.addEventListener("mouseup", mouseup)

    return () => {
      target.removeEventListener("mousemove", mousemove)
      target.removeEventListener("mouseenter", mouseenter)
      target.removeEventListener("mouseleave", mouseleave)
      target.removeEventListener("mouseup", mouseup)
    }
  }, [ref, type, types, onEnter, onLeave, onOver, onDrop])

  return ref
}
