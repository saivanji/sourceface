import React from "react"
import { createPortal } from "react-dom"
import { useDragLayer } from "react-dnd"
import * as itemTypes from "./itemTypes"
import * as utils from "./utils"

export default function Layer() {
  const { item, itemType, isDragging, currentOffset } = useDragLayer(
    monitor => ({
      item: monitor.getItem(),
      itemType: monitor.getItemType(),
      // TODO: can't we use getClientOffset() instead of getSourceClientOffset() everywhere?
      // refactor code in sortable first
      currentOffset: monitor.getSourceClientOffset(),
      isDragging: monitor.isDragging(),
    })
  )

  /**
   * When dropping the item on a drop target, "currentOffset" becomes "null", therefore
   * we need to handle that case.
   */
  if (!isDragging || !currentOffset) {
    return null
  }

  switch (itemType) {
    case itemTypes.SORTABLE_INNER: {
      const { SortPreview = "div" } = item.components
      const { unit, info, content } = item
      /**
       * Calculating size dynamically since it may vary when item is moved across
       * grids which have different cell sizes.
       */
      const width = utils.calcLeft(unit.w, info.cols, info.containerWidth)
      const height = utils.calcTop(unit.h, info.rowHeight)

      return (
        <div style={layerStyle}>
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
    case itemTypes.RESIZABLE: {
      const { ResizePreview = "div" } = item.components
      const { content, previewRef } = item

      const style = {}

      /**
       * Rendering preview within source grid to hide it under overflow when resize is
       * performed while scrolling the grid.
       */
      return createPortal(
        <ResizePreview style={{ ...style, ...resizeStyle }}>
          {content}
        </ResizePreview>,
        previewRef.current
      )
    }
    default:
      return null
  }
}

const layerStyle = {
  position: "fixed",
  pointerEvents: "none",
  zIndex: 100,
  left: 0,
  top: 0,
  width: "100%",
  height: "100%",
}

const resizeStyle = {
  position: "absolute",
  top: 0,
  left: 0,
}
