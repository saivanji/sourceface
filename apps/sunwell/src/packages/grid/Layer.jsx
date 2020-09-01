import React from "react"
import { useDragLayer } from "react-dnd"
import * as itemTypes from "./itemTypes"
import * as utils from "./utils"

// TODO: after every new drag preview dom node is not removed from them DOM
export default function Layer() {
  const { item, itemType, isDragging, currentOffset } = useDragLayer(
    monitor => ({
      item: monitor.getItem(),
      itemType: monitor.getItemType(),
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

  return (
    <div style={layerStyle}>{renderItem(item, itemType, currentOffset)}</div>
  )
}

const renderItem = (item, itemType, currentOffset) => {
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
        <SortPreview
          style={{
            transform: `translate(${currentOffset.x}px, ${currentOffset.y}px)`,
            width,
            height,
          }}
        >
          {content}
        </SortPreview>
      )
    }
    case itemTypes.RESIZABLE: {
      const { ResizePreview = "div" } = item.components
      const { content, preview } = item

      /**
       * Sometimes preview is empty at first tick so we render nothing in that case.
       * TODO: that causes small blink in the beginning in such cases. Probably in case
       * preview is empty use "getInitialSourceClientOffset" to get positions?
       */
      if (!preview) return null

      return <ResizePreview style={preview}>{content}</ResizePreview>
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
