import { useRef, useEffect, useContext } from "react"
import { context } from "./state"
import * as dom from "./dom"

export default (type, { onStart, onMove, onEnd }) => {
  const trigger = useRef()
  const local = useRef()
  const { provide, dragStart, dragEnd } = useContext(context)

  useEffect(() => {
    const lifecycle = provide({ onStart, onMove, onEnd })

    const mousemove = e => {
      if (!local.current) {
        local.current = {
          startX: e.clientX,
          startY: e.clientY,
          bodyStyles: dom.getStyles(document.body, ["user-select"]),
        }

        document.body.style["user-select"] = "none"

        dragStart(type)
        lifecycle.onStart(createAction(e, local.current))

        return
      }

      lifecycle.onMove(createAction(e, local.current))
    }

    const mouseup = () => {
      document.removeEventListener("mousemove", mousemove)
      document.removeEventListener("mouseup", mouseup)

      if (local.current) {
        dom.setStyles(document.body, local.current.bodyStyles)

        local.current = undefined
        dragEnd()
        lifecycle.onEnd()
      }
    }

    const mousedown = e => {
      if (e.target !== trigger.current || e.which !== 1) return

      document.addEventListener("mousemove", mousemove)
      document.addEventListener("mouseup", mouseup)
    }

    if (!local.current) {
      document.addEventListener("mousedown", mousedown)
    } else {
      document.addEventListener("mousemove", mousemove)
      document.addEventListener("mouseup", mouseup)
    }

    return () => {
      document.removeEventListener("mousedown", mousedown)
      document.removeEventListener("mousemove", mousemove)
      document.removeEventListener("mouseup", mouseup)
    }
  }, [trigger, type, dragStart, dragEnd, onStart, onMove, onEnd])

  return trigger
}

const createAction = ({ clientX, clientY }, { startX, startY }) => ({
  clientX,
  clientY,
  startX,
  startY,
  deltaX: clientX - startX,
  deltaY: clientY - startY,
})
