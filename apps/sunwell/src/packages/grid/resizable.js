import { useDrag, useDrop } from "react-dnd"
import * as itemTypes from "./itemTypes"
import * as utils from "./utils"

export const useResize = function Resizable(
  id,
  layout,
  content,
  components,
  previewRef
) {
  const inputs = createInputs(angle => ({
    item: {
      type: itemTypes.RESIZABLE,
      id,
      content,
      components,
      unit: layout[id],
      angle,
      previewRef,
    },
    collect: monitor => ({
      isResizing: monitor.isDragging(),
    }),
  }))

  const [nw, connectNw] = useDrag(inputs.nw)
  const [sw, connectSw] = useDrag(inputs.sw)
  const [ne, connectNe] = useDrag(inputs.ne)
  const [se, connectSe] = useDrag(inputs.se)

  return [
    connectNw,
    connectSw,
    connectNe,
    connectSe,
    nw.isResizing || sw.isResizing || ne.isResizing || se.isResizing,
  ]
}

export const useResizeArea = function ResizableArea(
  containerRef,
  initialLayout,
  info,
  onRestack,
  onReset,
  onChange
) {
  const [{ isOver }, connect] = useDrop({
    accept: itemTypes.RESIZABLE,
    collect: monitor => ({
      isOver: monitor.canDrop() && monitor.isOver(),
    }),
    /**
     * Restrict resizing within a current grid.
     */
    canDrop: item => !!initialLayout[item.id],
    hover: (item, monitor) => {
      /**
       * Preventing hovers on a parent container
       */
      if (!isOver) {
        return
      }

      const startBounds = utils.toBounds(initialLayout[item.id], info)
      const currentOffset = monitor.getSourceClientOffset()

      /**
       * Might be a performance concern. Think of using throttling.
       */
      const rect = containerRef.current.getBoundingClientRect()
      const cursor = utils.cursor(currentOffset.x, currentOffset.y, rect)

      /**
       * Calculating movements based on cursor and start position.
       */
      const moveX = cursor.left - (startBounds.left + startBounds.width)
      const moveY = cursor.top - (startBounds.top + startBounds.height)

      // TODO: resize result is wrong a bit
      const nextBounds = utils.resize(
        item.angle,
        moveX,
        moveY,
        startBounds,
        info
      )
      const nextCoords = utils.toCoords(nextBounds, info)

      if (utils.coordsEqual(item.unit, nextCoords)) return

      const nextUnit = {
        ...item.unit,
        ...nextCoords,
      }

      onRestack(utils.put(item.id, nextUnit, initialLayout))

      /**
       * In order to have the latest unit object on the next tick, item object needs
       * to be mutated.
       */
      item.unit = nextUnit
    },
    drop: (item, monitor) => {
      const itemType = monitor.getItemType()
      const layout = utils.put(item.id, item.unit, initialLayout)

      onChange(
        utils.createEvent(events.RESIZE, layout, item.id, itemType, "transfer")
      )
      onReset()
    },
  })

  return [connect, isOver]
}

/**
 * Function for creating input objects for all angles.
 */
const createInputs = fn =>
  ["nw", "sw", "ne", "se"].reduce(
    (acc, angle) => ({
      ...acc,
      [angle]: fn(angle),
    }),
    {}
  )

const events = {
  RESIZE: "resize",
}
