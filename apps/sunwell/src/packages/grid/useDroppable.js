// TODO: move some generic code to utils

import { useCallback, useState } from "react"
import { useDrop } from "../dnd"
import * as utils from "./utils"

export default (
  layout,
  container,
  info,
  { onLayoutEdit, onLayoutUpdate, onLayoutReset, onChange }
) => {
  const [dropping, setDropping] = useState(null)

  const onOver = useCallback(
    (transfer, { type, pageX, pageY }) => {
      if (!container) return

      const { left, top } = utils.cursor(pageX, pageY, container)

      if (type === "outer") {
        const round = v => Math.ceil(v) - 1

        return move(transfer, left, top, layout, info, onLayoutUpdate, round)
      }

      if (type === "inner") {
        const { shiftX, shiftY } = transfer
        return move(
          transfer,
          left - shiftX,
          top - shiftY,
          layout,
          info,
          onLayoutUpdate,
          Math.round
        )
      }
    },
    [container, info, onLayoutUpdate]
  )

  const onEnter = useCallback(
    ({ id }, { type }) => {
      onLayoutEdit()
      setDropping({ id, type })
    },
    [onLayoutEdit]
  )

  const onFinish = useCallback(() => {
    onLayoutReset()
    setDropping(null)
  }, [onLayoutReset])

  const onLeave = useCallback(
    ({ id }, { type }) => {
      onFinish()

      return {
        leaved: {
          id,
          onChange: () =>
            onChange({ type: "leave", layout: utils.without(id, layout), id }),
        },
      }
    },
    [layout, onFinish, onChange]
  )

  const onDrop = useCallback(
    ({ id, leaved }, { type }) => {
      onFinish()

      if (type === "outer") {
        console.log({
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

      leaved?.onChange()

      console.log(event)
    },
    [layout, onFinish, onChange]
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
  layout,
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

  onLayoutUpdate(utils.put(id, nextCoords, layout))

  return {
    coords: nextCoords,
  }
}

// const range = v => v <= 0 ? 0 : v >= x && v < x + w ? x : v >= info.cols - w ? info.cols - w : v
