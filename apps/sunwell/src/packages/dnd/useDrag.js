import { useRef, useEffect, useContext } from "react"
import { context } from "./state"
import * as dom from "./dom"

export default (type, { onStart, onMove, onEnd }) => {
  const trigger = useRef()
  const local = useRef()
  const connect = useRef()
  const { provide, start, reset } = useContext(context)

  useEffect(() => () => local.current && reset(), [local, reset])

  useEffect(() => {
    const lifecycle = provide({ onStart, onMove, onEnd })

    const mousemove = e => {
      e.preventDefault()

      if (!local.current) {
        local.current = {
          startX: e.clientX,
          startY: e.clientY,
        }

        start(type)
        lifecycle.onStart(createAction(e, local.current))

        return
      }

      lifecycle.onMove(createAction(e, local.current))
    }

    const mouseup = () => {
      // trigger.current && (trigger.current.style["pointer-events"] = "")

      document.removeEventListener("mousemove", mousemove)
      document.removeEventListener("mouseup", mouseup)

      if (local.current) {
        local.current = undefined
        reset()
        lifecycle.onEnd()
      }
    }

    const mousedown = e => {
      if (e.which !== 1) return

      // do not triggering "onEnter" drop events in case trigger is onmounted on drag start
      // trigger.current.style["pointer-events"] = "none"

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
  }, [local, trigger, type, start, reset, onStart, onMove, onEnd])

  return node => {
    trigger.current = node
    connect.current && connect.current()
  }
}

const createAction = (
  { clientX, clientY, pageX, pageY },
  { startX, startY }
) => ({
  pageX,
  pageY,
  clientX,
  clientY,
  deltaX: clientX - startX,
  deltaY: clientY - startY,
})
