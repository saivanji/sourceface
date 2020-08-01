import { useCallback, useState } from "react"
import { useDrop } from "../dnd"
import { useCall } from "./Provider"
import * as utils from "./utils"

export default (
  initialLayout,
  layout,
  container,
  info,
  changeId,
  { onLayoutEdit, onLayoutUpdate, onLayoutReset, onChange }
) => {
  const [dropping, setDropping] = useState(null)
  const change = useCall()

  const onOver = useCallback(
    (transfer, { type, pageX, pageY }) => {
      if (!container) return

      const { left, top } = utils.cursor(pageX, pageY, container)

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
    [initialLayout, container, info, onLayoutUpdate]
  )

  const onEnter = useCallback(
    ({ id, leaved }, { type }) => {
      onLayoutEdit()
      setDropping({ id, type })

      if (type === "inner" && leaved && layout[id]) {
        return { leaved: undefined }
      }
    },
    [layout, onLayoutEdit]
  )

  const onFinish = useCallback(() => {
    onLayoutReset()
    setDropping(null)
  }, [onLayoutReset])

  const onLeave = useCallback(
    ({ id }, { type }) => {
      onFinish()

      if (type === "inner") {
        return {
          leaved: {
            id,
            layout: utils.without(id, layout),
            changeId,
          },
        }
      }
    },
    [layout, changeId, onFinish, onChange]
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
        type: leaved ? "enter" : "update",
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

  // angle type is not needed here, resize will be in a drag handler
  const ref = useDrop(["inner", "outer"], {
    onOver,
    onEnter,
    onLeave,
    onDrop,
  })

  return [ref, dropping]
}

const move = (
  { id, coords },
  left,
  top,
  initialLayout,
  info,
  onLayoutUpdate,
  round
) => {
  const pointX = round(left / info.minWidth)
  const pointY = round(top / info.minHeight)

  const nextX = utils.range(pointX, 0, info.cols - coords.w)
  const nextY = utils.range(pointY, 0, info.rows - coords.h)

  if (coords.x === nextX && coords.y === nextY) return

  const nextCoords = {
    ...coords,
    x: nextX,
    y: nextY,
  }

  onLayoutUpdate(utils.put(id, nextCoords, initialLayout))

  return {
    coords: nextCoords,
  }
}

// const range = v => v <= 0 ? 0 : v >= x && v < x + w ? x : v >= info.cols - w ? info.cols - w : v
