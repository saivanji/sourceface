import React from "react"
import { useDragLayer } from "react-dnd"
import * as itemTypes from "./itemTypes"

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
    case itemTypes.INNER: {
      const { DragPreview = "div" } = item.components
      return (
        <DragPreview
          style={{
            transform: `translate(${currentOffset.x}px, ${currentOffset.y}px)`,
            width: item.bounds.width,
            height: item.bounds.height,
          }}
        >
          {item.content}
        </DragPreview>
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
