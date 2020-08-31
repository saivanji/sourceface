import { useRef, useEffect } from "react"
import { useDrop } from "react-dnd"
import * as itemTypes from "./itemTypes"
import * as utils from "./utils"

export default (
  containerRef,
  initialLayout,
  info,
  onRestack,
  onReset,
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
       * Preventing hovers on a parent container
       */
      if (!isOver) {
        return
      }

      /**
       * Putting reset function so it can be called on drag end when item
       * is dropped outside of a grid.
       */
      if (!item.reset) {
        item.reset = onReset
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
      const isLeft = !initialLayout[item.id]
      const itemType = monitor.getItemType()
      const didDrop = monitor.didDrop()

      /**
       * When dropping the item on a nested grid, "drop" callback is called on all parent
       * grids additionally. Using "didDrop" to understand whether "drop" callback was called.
       */
      if (didDrop) {
        return
      }

      /**
       * In case dropping id does not exists on initial layout then we are moving item
       * from one grid to another and can call "leave" function of the original grid.
       */
      if (item.leave && isLeft) {
        item.leave()
        item.reset()
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
      onReset()
    },
  })

  /**
   * In case grid initially has dragging item - updating it with the layout without
   * the item. Otherwise - resetting a grid.
   */
  useLeave(
    () =>
      initialLayout[item.id]
        ? onRestack(utils.without(item.id, initialLayout))
        : onReset(),
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
