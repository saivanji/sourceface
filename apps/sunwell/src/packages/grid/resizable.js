import { useDrag, useDrop } from "react-dnd"
import * as itemTypes from "./itemTypes"
import * as utils from "./utils"

export const useResize = function Resizable(
  id,
  layout,
  info,
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
      info,
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

      const bounds = utils.toBounds(item.unit, info)
      const clientOffset = monitor.getClientOffset()

      /**
       * Might be a performance concern. Think of using throttling.
       */
      const rect = containerRef.current.getBoundingClientRect()
      const cursor = utils.cursor(clientOffset.x, clientOffset.y, rect)

      const nextBounds = utils.resize(item.angle, cursor, bounds, info)
      const nextCoords = utils.toCoords(nextBounds, info)

      /**
       * Passing "rect" down to the "item" object so it can be accessed in
       * Layer for rendering resize preview.
       */
      item.rect = rect

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

      onChange(utils.createEvent(events.RESIZE, layout, item.id, itemType))
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
