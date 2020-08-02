import { useCallback, useState } from "react"
import { useDrag } from "../dnd"
import * as utils from "./utils"

export default (id, initialLayout, layout, info, containerRef, callbacks) => {
  const [previewStyle, setPreviewStyle] = useState(null)

  const args = [
    id,
    initialLayout,
    layout,
    info,
    containerRef,
    setPreviewStyle,
    callbacks,
  ]

  const nwRef = useResizableAngle("nw", ...args)
  const swRef = useResizableAngle("sw", ...args)
  const neRef = useResizableAngle("ne", ...args)
  const seRef = useResizableAngle("se", ...args)

  return [nwRef, swRef, neRef, seRef, previewStyle]
}

const useResizableAngle = (
  angle,
  id,
  initialLayout,
  layout,
  info,
  containerRef,
  setPreviewStyle,
  { onLayoutEdit, onLayoutUpdate, onLayoutReset, onChange }
) => {
  const unit = initialLayout[id]

  const onStart = useCallback(() => {
    const { x, y, w, h } = unit
    const start = utils.toBounds(unit, info)
    onLayoutEdit()

    return { coords: { w, h, x, y }, start }
  }, [unit, info, onLayoutEdit])

  const onMove = useCallback(
    ({ coords, start }, { deltaX, deltaY }) => {
      const nextBounds = utils.resize(angle, deltaX, deltaY, start, info)
      const nextCoords = utils.toCoords(nextBounds, info)
      const nextUnit = { ...initialLayout[id], ...nextCoords }

      setPreviewStyle(utils.toBoxCSS(nextBounds))

      if (utils.coordsEqual(coords, nextCoords)) return

      onLayoutUpdate(utils.put(id, nextUnit, initialLayout))

      return {
        coords: nextCoords,
      }
    },
    [angle, id, initialLayout, info, setPreviewStyle, onLayoutUpdate]
  )

  const onEnd = useCallback(() => {
    onLayoutReset()
    setPreviewStyle(null)
    onChange({ type: "resize", layout, id })
  }, [id, layout, setPreviewStyle, onLayoutReset, onChange])

  return useDrag("angle", { onStart, onMove, onEnd })
}
