import { useRef, useEffect } from "react"
import { useDrop } from "react-dnd"
import * as itemTypes from "./itemTypes"
import * as utils from "./utils"

// TODO: when Sam is dropped on a root parent surface, it appears again, when another item is dropped on his grid.
// TODO: in all cases do a reset of a temp layout in case drop happened
export default (
  containerRef,
  initialLayout,
  info,
  onRestack,
  onFinish,
  onChange
) => {
  const [{ item, isOver, didDrop }, dropRef] = useDrop({
    accept: itemTypes.DRAGGABLE_INNER,
    collect: monitor => ({
      item: monitor.getItem(),
      isOver: monitor.isOver({ shallow: true }),
      didDrop: monitor.didDrop(),
    }),
    hover: (item, monitor) => {
      const itemType = monitor.getItemType()

      /**
       * Putting reset function so it can be called on drag end when item
       * is dropped outside of a grid.
       */
      if (!item.reset) {
        item.reset = onFinish
      }

      /**
       * Putting leave function to the "item" object, so it can be called in case drop will
       * happen on another grid.
       */
      if (!item.leave) {
        item.leave = () =>
          onChange(
            utils.createEvent(
              events.LEAVE,
              utils.without(item.id, initialLayout),
              item.id,
              itemType,
              "transfer"
            )
          )
      }

      /**
       * Preventing hovers on a parent container
       */
      if (!isOver) {
        return
      }

      /**
       * Mutating item object with info from the drop container so drag preview can
       * adjust it's size when target layout grid is different from the original.
       */
      item.info = info

      const currentOffset = monitor.getSourceClientOffset()
      /**
       * Might be a performance concern.
       */
      const rect = containerRef.current.getBoundingClientRect()
      const cursor = utils.cursor(currentOffset.x, currentOffset.y, rect)

      const nextX = utils.calcX(cursor.left, item.unit.w, info, Math.round)
      const nextY = utils.calcY(cursor.top, item.unit.h, info, Math.round)

      if (nextX === item.unit.x && nextY === item.unit.y) {
        return
      }

      const nextUnit = {
        ...item.unit,
        x: nextX,
        y: nextY,
      }

      onRestack(utils.put(item.id, nextUnit, initialLayout))

      /**
       * In order to have the latest unit object on the next tick, item object needs
       * to be mutated.
       */
      item.unit = nextUnit
    },
    drop: (item, monitor) => {
      // TODO: drop is called 2 times. 2nd time is on a wrong area

      console.log("drop")
      const isLeft = !initialLayout[item.id]
      const itemType = monitor.getItemType()

      /**
       * In case dropping id does not exists on initial layout then we are moving item
       * from one grid to another and can call "leave" function of the original grid.
       */
      if (item.leave && isLeft) {
        item.leave()
        // TODO: should call reset here as well?
      }

      const layout = utils.put(item.id, item.unit, initialLayout)

      const event = utils.createEvent(
        isLeft ? events.ENTER : events.DRAG,
        layout,
        item.id,
        itemType,
        "transfer"
      )

      onChange(event)
      onFinish()
    },
  })

  /**
   * Updating a grid with layout without the dragging item when it'is left.
   */
  useLeave(
    () => onRestack(utils.without(item.id, initialLayout)),
    isOver,
    didDrop
  )

  return [dropRef, isOver, item]
}

const useLeave = (callback, isOver, didDrop) => {
  const ref = useRef(isOver)

  useEffect(() => {
    if (ref.current && !isOver && !didDrop) {
      callback()
    }

    ref.current = isOver
  }, [ref, isOver, didDrop])
}

const events = {
  LEAVE: "leave",
  ENTER: "enter",
  DRAG: "drag",
}
