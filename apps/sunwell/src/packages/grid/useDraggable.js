import { useCallback, useState } from "react"
import { useDrag } from "../dnd"
import { useApply } from "./hooks"
import * as utils from "./utils"

export default (id, layout, info, container) => {
  const [previewStyle, setPreviewStyle] = useState(null)
  const coords = layout[id]
  const bounds = useApply(utils.toBounds, [coords, info])

  const onStart = useCallback(
    (transfer, { pageX, pageY }) => {
      const { left, top } = utils.cursor(pageX, pageY, container)
      const shiftX = left - bounds.left
      const shiftY = top - bounds.top

      return {
        id,
        coords,
        shiftX,
        shiftY,
      }
    },
    [id, coords, bounds]
  )

  const onMove = useCallback((transfer, { deltaX, deltaY }) => {
    setPreviewStyle(
      utils.toBoxCSS(
        utils.drag(container.left + deltaX, container.top + deltaY, bounds)
      )
    )
  }, [])

  const onEnd = useCallback(() => setPreviewStyle(null), [])

  const ref = useDrag("inner", {
    onStart,
    onMove,
    onEnd,
  })

  return [ref, previewStyle]
}
