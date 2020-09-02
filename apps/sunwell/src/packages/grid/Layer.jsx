import React from "react"
import { createPortal } from "react-dom"
import { useDragLayer } from "react-dnd"
import * as itemTypes from "./itemTypes"
import * as utils from "./utils"

export default function Layer() {
  const {
    item,
    itemType,
    isDragging,
    sourceOffset,
    clientOffset,
  } = useDragLayer(monitor => ({
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    sourceOffset: monitor.getSourceClientOffset(),
    clientOffset: monitor.getClientOffset(),
    isDragging: monitor.isDragging(),
  }))

  /**
   * When dropping the item on a drop target, "sourceOffset" becomes "null", therefore
   * we need to handle that case.
   */
  if (!isDragging || !sourceOffset) {
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
              transform: `translate(${sourceOffset.x}px, ${sourceOffset.y}px)`,
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
      const { angle, content, previewRef, rect, unit, info } = item

      const startBounds = utils.toBounds(unit, info)
      const style = utils.toBoxCSS(
        !rect
          ? startBounds
          : resizePreview(angle, clientOffset, startBounds, info, rect)
      )

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

const resizePreview = (angle, clientOffset, startBounds, info, rect) => {
  const cursor = utils.cursor(clientOffset.x, clientOffset.y, rect)
  return utils.resize(angle, cursor, startBounds, info)
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
