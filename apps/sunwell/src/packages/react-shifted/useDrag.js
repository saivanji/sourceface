import { useRef, useEffect, useContext } from "react"
import { context } from "./state"
import * as dom from "./dom"

export default (type, callbacks = {}) => {
  const ref = useRef()
  const localRef = useRef({})
  const { provide, dragStart, dragEnd } = useContext(context)

  const { onStart, onMove, onEnd } = provide(callbacks)

  useEffect(() => {
    const trigger = ref.current
    const local = localRef.current

    const mousemove = e => {
      if (!local.dragged) {
        local.dragged = true
        local.startX = e.clientX
        local.startY = e.clientY
        local.bodyStyles = dom.getStyles(trigger, ["user-select"])

        document.body.style["user-select"] = "none"

        dragStart(type)
        onStart && onStart()

        return
      }

      const deltaX = e.clientX - local.startX
      const deltaY = e.clientY - local.startY

      onMove && onMove({ deltaX, deltaY })
    }

    const mouseup = () => {
      document.removeEventListener("mousemove", mousemove)
      document.removeEventListener("mouseup", mouseup)

      if (local.dragged) {
        dom.setStyles(document.body, local.bodyStyles)

        dragEnd()
        onEnd && onEnd()
        localRef.current = {}
      }
    }

    const mousedown = e => {
      if (e.which !== 1) return

      document.addEventListener("mousemove", mousemove)
      document.addEventListener("mouseup", mouseup)
    }

    if (!local.dragged) {
      trigger?.addEventListener("mousedown", mousedown)
    } else {
      document.addEventListener("mousemove", mousemove)
      document.addEventListener("mouseup", mouseup)
    }

    return () => {
      trigger?.removeEventListener("mousedown", mousedown)
      document.removeEventListener("mousemove", mousemove)
      document.removeEventListener("mouseup", mouseup)
    }
  }, [type, dragStart, dragEnd, onStart, onMove, onEnd])

  return ref
}
