import { useCallback, useState } from "react"
import { useDrop } from "../dnd"
import { useCall } from "./Provider"
import * as utils from "./utils"

export default (
  initialLayout,
  layout,
  containerRef,
  info,
  changeId,
  { onLayoutEdit, onLayoutUpdate, onLayoutReset, onChange }
) => {
  const [dropping, setDropping] = useState(null)
  const change = useCall()

  const onOver = useCallback(
    (transfer, { type, clientX, clientY }) => {
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

  const onEnter = useCallback(
    (transfer, { type, clientX, clientY }) => {
      const { id, leaved, shiftX, shiftY } = transfer
      const rect = containerRef.current.getBoundingClientRect()

      onLayoutEdit()
      setDropping({ id, type })

      if (type === "inner" && leaved && layout[id]) {
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

        return { ...result, rect, leaved: undefined }
      }

      return { rect }
    },
    [initialLayout, layout, containerRef, info, onLayoutEdit, onLayoutUpdate]
  )

  const onFinish = useCallback(() => {
    onLayoutReset()
    setDropping(null)
  }, [onLayoutReset])

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

  const onDrop = useCallback(
    ({ id, leaved }, { type }) => {
      onFinish()

      if (type === "outer") {
        onChange({
          type: "enter",
          layout,
          id,
        })
        return
      }

      const event = {
        type: leaved ? "enter" : "drag",
        layout,
        id,
      }

      if (leaved) {
        change(leaved.changeId, {
          type: "leave",
          layout: leaved.layout,
          id: leaved.id,
        })
      }

      onChange(event)
    },
    [layout, change, onFinish, onChange]
  )

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

  onLayoutUpdate(utils.put(id, nextUnit, initialLayout))

  return {
    unit: nextUnit,
  }
}
