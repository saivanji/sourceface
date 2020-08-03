import { useCallback, useState } from "react"
import { useDrag } from "../dnd"
import { useApply } from "./hooks"
import * as utils from "./utils"

export default (id, layout, info, containerRef) => {
  const [previewStyle, setPreviewStyle] = useState(null)
  const unit = layout[id]
  const bounds = useApply(utils.toBounds, [unit, info])

  // handleStart
  const onStart = useCallback(
    (transfer, { clientX, clientY }) => {
      const rect = containerRef.current.getBoundingClientRect()
      const { left, top } = utils.cursor(clientX, clientY, rect)

      const shiftX = left - bounds.left
      const shiftY = top - bounds.top

      return {
        id,
        unit,
        shiftX,
        shiftY,
      }
    },
    [containerRef, id, unit, bounds]
  )

  // handleMove
  const onMove = useCallback(
    ({ shiftX, shiftY }, { clientX, clientY }) => {
      const nextBounds = {
        ...bounds,
        left: clientX - shiftX,
        top: clientY - shiftY,
      }

      setPreviewStyle(utils.toBoxCSS(nextBounds))
    },
    [bounds]
  )

  // handleEnd
  const onEnd = useCallback(() => setPreviewStyle(null), [])

  const ref = useDrag("inner", {
    onStart,
    onMove,
    onEnd,
  })

  return [ref, previewStyle]
}
