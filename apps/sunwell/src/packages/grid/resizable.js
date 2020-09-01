import { useDrag, useDrop } from "react-dnd"
import * as itemTypes from "./itemTypes"
import * as utils from "./utils"

export const useResize = function Resizable(id, layout, content, components) {
  const inputs = createInputs(angle => ({
    item: {
      type: itemTypes.RESIZABLE,
      id,
      content,
      components,
      unit: layout[id],
      angle,
      // TODO: pass "preview" as well to avoid blink?
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

// TODO: create symbol in a grid instance and pass as type in order not to conflicts with sibling surfaces?
// Most likely that additionally will let us get rid of "isOver" variable.
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
      isOver: monitor.isOver({ shallow: true }),
    }),
    hover: (item, monitor) => {
      /**
       * Preventing hovers on a parent container
       */
      if (!isOver) {
        return
      }

      const start = utils.toBounds(initialLayout[item.id], info)
      const delta = monitor.getDifferenceFromInitialOffset()
      const nextBounds = utils.resize(item.angle, delta.x, delta.y, start, info)
      const nextCoords = utils.toCoords(nextBounds, info)

      /**
       * Might be a performance concern. Think of using throttling.
       */
      const rect = containerRef.current.getBoundingClientRect()

      /**
       * Assigning preview info so it can be accessed in Layer component.
       */
      item.preview = preview(nextBounds, rect)

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
 * Considering container boundaries while calculating preview position.
 */
const preview = (bounds, rect) => {
  return utils.toBoxCSS({
    ...bounds,
    left: rect.left + bounds.left,
    top: rect.top + bounds.top,
  })
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
