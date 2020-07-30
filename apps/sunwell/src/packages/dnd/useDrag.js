import { useRef, useEffect, useContext } from "react"
import { context } from "./state"
import * as dom from "./dom"

export default (type, { onStart, onMove, onEnd }) => {
  const trigger = useRef()
  const local = useRef()
  const connect = useRef()
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
      trigger.current && (trigger.current.style["pointer-events"] = "")
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
      if (e.which !== 1) return

      // do not triggering "onEnter" drop events in case trigger is onmounted on drag start
      trigger.current.style["pointer-events"] = "none"

      document.addEventListener("mousemove", mousemove)
      document.addEventListener("mouseup", mouseup)
    }

    connect.current = () => {
      trigger.current?.addEventListener("mousedown", mousedown)
      if (local.current) {
        document.addEventListener("mousemove", mousemove)
        document.addEventListener("mouseup", mouseup)
      }
    }
    connect.current()

    return () => {
      trigger.current?.removeEventListener("mousedown", mousedown)
      if (local.current) {
        document.removeEventListener("mousemove", mousemove)
        document.removeEventListener("mouseup", mouseup)
      }
    }
  }, [trigger, type, dragStart, dragEnd, onStart, onMove, onEnd])

  return node => {
    trigger.current = node
    connect.current && connect.current()
  }
}

const createAction = ({ clientX, clientY }, { startX, startY }) => ({
  clientX,
  clientY,
  startX,
  startY,
  deltaX: clientX - startX,
  deltaY: clientY - startY,
})
