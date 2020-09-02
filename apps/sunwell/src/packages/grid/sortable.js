import { useRef, useEffect } from "react"
import { useDrag, useDrop } from "react-dnd"
import * as itemTypes from "./itemTypes"
import * as utils from "./utils"

export const useSort = function Sort(id, layout, info, content, components) {
  const [{ isSorting }, connect] = useDrag({
    item: {
      type: itemTypes.SORTABLE_INNER,
      id,
      content,
      components,
      unit: layout[id],
      info,
    },
    collect: monitor => ({
      isSorting: monitor.isDragging(),
    }),
    end: (item, monitor) => {
      const didDrop = monitor.didDrop()

      /**
       * Resetting source grid to the initial state when item was dropped
       * out of the grid.
       */
      if (item.reset && !didDrop) {
        item.reset()
      }
    },
  })

  return [connect, isSorting]
}

export const useSortArea = function SortArea(
  containerRef,
  initialLayout,
  info,
  onRestack,
  onReset,
  onChange
) {
  const [{ item, itemType, isOver, didDrop }, connect] = useDrop({
    accept: [itemTypes.SORTABLE_INNER, itemTypes.SORTABLE_OUTER],
    collect: monitor => ({
      item: monitor.getItem(),
      itemType: monitor.getItemType(),
      isOver: monitor.isOver({ shallow: true }),
      didDrop: monitor.didDrop(),
    }),
    hover: (item, monitor) => {
      /**
       * Preventing hovers on a parent container
       */
      if (!isOver) {
        return
      }

      const itemType = monitor.getItemType()

      /**
       * Putting reset function for the source layout, so it can be resetted
       * when needed.
       */
      if (itemType === itemTypes.SORTABLE_INNER && !item.reset) {
        item.reset = onReset
      }

      /**
       * Putting leave function to the "item" object, so it can be called in case drop will
       * happen on another grid.
       */
      if (itemType === itemTypes.SORTABLE_INNER && !item.leave) {
        item.leave = () =>
          onChange(
            utils.createEvent(
              events.LEAVE,
              utils.without(item.id, initialLayout),
              item.id,
              itemType
            )
          )
      }

      /**
       * Mutating item object with info from the drop container so SortLayer can
       * adjust it's size when target layout grid is different from the original.
       */
      item.info = info

      const currentOffset = monitor.getSourceClientOffset()
      /**
       * Might be a performance concern. Think of using throttling.
       */
      const rect = containerRef.current.getBoundingClientRect()
      const cursor = utils.cursor(currentOffset.x, currentOffset.y, rect)
      const round =
        itemType === itemTypes.SORTABLE_OUTER ? utils.round : Math.round

      const nextX = utils.calcX(cursor.left, item.unit.w, info, round)
      const nextY = utils.calcY(cursor.top, item.unit.h, info, round)

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
      if (itemType === itemTypes.SORTABLE_INNER && isLeft) {
        item.leave()
        item.reset()
      }

      const layout = utils.put(item.id, item.unit, initialLayout)

      const event = utils.createEvent(
        isLeft ? events.ENTER : events.SORT,
        layout,
        item.id,
        itemType
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

  return [connect, isOver, item, itemType]
}

const useLeave = function Leave(callback, isOver, didDrop) {
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
  SORT: "sort",
}
