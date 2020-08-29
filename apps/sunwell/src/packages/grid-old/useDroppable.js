import { useCallback, useState } from "react"
import { useDrop, useMiddleware } from "../dnd"
import { useCall } from "./Provider"
import * as utils from "./utils"

export default (
  initialLayout,
  layout,
  containerRef,
  info,
  changeId,
  // onEnter, onRestack, onFinish, onChange // think more of these names
  { onLayoutEdit, onLayoutUpdate, onLayoutReset, onChange }
) => {
  const [dropping, setDropping] = useState(null)
  const change = useCall()

  // provideRect
  const withRect = useCallback(
    ({ rectCounted }) => {
      const now = Date.now()

      if (rectCounted && (now - rectCounted) / 1000 < 1) return

      return {
        rectCounted: now,
        rect: containerRef.current.getBoundingClientRect(),
      }
    },
    [containerRef]
  )

  // move...
  const onMove = useCallback(
    (transfer, { type, clientX, clientY }) => {
      console.log("move")
      const { left, top } = utils.cursor(clientX, clientY, transfer.rect)

      if (type === "outer") {
        const round = v => Math.ceil(v) - 1
        return move(
          transfer,
          left,
          top,
          initialLayout,
          info,
          onLayoutUpdate,
          round
        )
      }

      if (type === "inner") {
        const { shiftX, shiftY } = transfer
        return move(
          transfer,
          left - shiftX,
          top - shiftY,
          initialLayout,
          info,
          onLayoutUpdate,
          Math.round
        )
      }
    },
    [initialLayout, info, onLayoutUpdate]
  )

  // handleEnter
  const onEnter = useCallback(
    (transfer, { type, clientX, clientY }) => {
      console.log("enter")
      const { id, leaved, shiftX, shiftY } = transfer

      onLayoutEdit()
      setDropping({ id, type })

      if (type === "inner" && leaved && layout[id]) {
        const rect = containerRef.current.getBoundingClientRect()
        const { left, top } = utils.cursor(clientX, clientY, rect)

        // TODO: check whether it's working
        const result =
          move(
            transfer,
            left - shiftX,
            top - shiftY,
            initialLayout,
            info,
            onLayoutUpdate,
            Math.round
          ) || {}

        return { ...result, leaved: undefined }
      }
    },
    [containerRef, initialLayout, layout, info, onLayoutEdit, onLayoutUpdate]
  )

  // finish
  const onFinish = useCallback(() => {
    onLayoutReset()
    setDropping(null)
  }, [onLayoutReset])

  // handleLeave
  const onLeave = useCallback(
    ({ id, leaved }, { type }) => {
      onFinish()

      if (type === "inner" && !leaved) {
        return {
          leaved: {
            id,
            layout: utils.without(id, layout),
            changeId,
          },
        }
      }
    },
    [layout, changeId, onFinish]
  )

  // handleDrop
  const onDrop = useCallback(
    (transfer, { type }) => {
      const { id, leaved } = transfer

      onFinish()

      if (type === "outer") {
        onChange(utils.createEvent("enter", layout, id, type, transfer))
        return
      }

      const event = utils.createEvent(
        leaved ? "enter" : "drag",
        layout,
        id,
        type,
        transfer
      )

      if (leaved) {
        change(
          leaved.changeId,
          utils.createEvent("leave", leaved.layout, leaved.id, type, transfer)
        )
      }

      onChange(event)
    },
    [layout, change, onFinish, onChange]
  )

  // handleOver
  const onOver = useMiddleware(withRect, onMove)

  const ref = useDrop(["inner", "outer"], {
    onOver,
    onEnter,
    onLeave,
    onDrop,
  })

  return [ref, dropping]
}

const move = (
  { id, unit },
  left,
  top,
  initialLayout,
  info,
  onLayoutUpdate,
  round
) => {
  const nextX = utils.calcX(left, unit.w, info, round)
  const nextY = utils.calcY(top, unit.h, info, round)

  const nextUnit = {
    ...unit,
    x: nextX,
    y: nextY,
  }

  if (utils.coordsEqual(unit, nextUnit)) return

  // onRestack
  onLayoutUpdate(utils.put(id, nextUnit, initialLayout))

  return {
    unit: nextUnit,
  }
}
