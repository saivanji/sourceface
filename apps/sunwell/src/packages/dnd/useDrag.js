import { useRef, useEffect, useContext } from "react"
import { context } from "./state"

export default (type, { onStart, onMove, onEnd }) => {
  const source = useRef()
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
      // source.current && (source.current.style["pointer-events"] = "")

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

      // TODO: replase "stopPropagation" by a condition for checking whether the drag is currently
      // in progress. Stopping propagation may lead to unpredictable consequences when we set global
      // click handlers, for example on "document". But keep in mind that we might have a case with
      // 2+ different DnDProvider's.
      e.stopPropagation()

      // do not triggering "onEnter" drop events in case source is onmounted on drag start
      // source.current.style["pointer-events"] = "none"

      document.addEventListener("mousemove", mousemove)
      document.addEventListener("mouseup", mouseup)
    }

    connect.current = () => {
      source.current?.addEventListener("mousedown", mousedown)
      if (local.current) {
        document.addEventListener("mousemove", mousemove)
        document.addEventListener("mouseup", mouseup)
      }
    }
    connect.current()

    return () => {
      source.current?.removeEventListener("mousedown", mousedown)
      if (local.current) {
        document.removeEventListener("mousemove", mousemove)
        document.removeEventListener("mouseup", mouseup)
      }
    }
  }, [local, source, type, start, reset, onStart, onMove, onEnd])

  return node => {
    source.current = node
    connect.current && connect.current()
  }
}

const createAction = ({ clientX, clientY }, { startX, startY }) => ({
  clientX,
  clientY,
  deltaX: clientX - startX,
  deltaY: clientY - startY,
})
