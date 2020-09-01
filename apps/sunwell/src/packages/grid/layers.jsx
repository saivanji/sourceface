import React from "react"
import { useDragLayer } from "react-dnd"
import * as itemTypes from "./itemTypes"
import * as utils from "./utils"

/**
 * SortLayer needs to be rendered globally since having it locally causes
 * preview to be shifted when rendered in a nested grids.
 */
export function SortLayer() {
  const { item, itemType, isDragging, currentOffset } = useDragLayer(
    monitor => ({
      item: monitor.getItem(),
      itemType: monitor.getItemType(),
      /**
       * Might be a performance concern for ResizeLayer since we call SortLayer
       * as well when doing a resize.
       */
      currentOffset: monitor.getSourceClientOffset(),
      isDragging: monitor.isDragging(),
    })
  )

  /**
   * When dropping the item on a drop target, "currentOffset" becomes "null", therefore
   * we need to handle that case.
   */
  if (!isDragging || !currentOffset || itemType !== itemTypes.SORTABLE_INNER) {
    return null
  }

  const { SortPreview = "div" } = item.components
  const { unit, info, content } = item
  /**
   * Calculating size dynamically since it may vary when item is moved across
   * grids which have different cell sizes.
   */
  const width = utils.calcLeft(unit.w, info.cols, info.containerWidth)
  const height = utils.calcTop(unit.h, info.rowHeight)

  return (
    <div style={sortLayerStyle}>
      <SortPreview
        style={{
          transform: `translate(${currentOffset.x}px, ${currentOffset.y}px)`,
          width,
          height,
        }}
      >
        {content}
      </SortPreview>
    </div>
  )
}

// TODO: rendering under "isOver" condition causes preview to disappear when hovered out of a grid
/**
 * ResizeLayer needs to be rendered locally to hide it under overflow when resize
 * is performed while scrolling the grid.
 */
export function ResizeLayer({ initialLayout, info, components }) {
  const { item, itemType, isDragging, delta } = useDragLayer(monitor => ({
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    isDragging: monitor.isDragging(),
    delta: monitor.getDifferenceFromInitialOffset(),
  }))

  if (!isDragging || !delta || itemType !== itemTypes.RESIZABLE) {
    return null
  }

  const { ResizePreview = "div" } = components
  const { id, angle, content } = item
  const start = utils.toBounds(initialLayout[id], info)
  const style = utils.toBoxCSS(
    utils.resize(angle, delta.x, delta.y, start, info)
  )

  return <ResizePreview style={style}>{content}</ResizePreview>
}

const sortLayerStyle = {
  position: "fixed",
  pointerEvents: "none",
  zIndex: 100,
  left: 0,
  top: 0,
  width: "100%",
  height: "100%",
}
