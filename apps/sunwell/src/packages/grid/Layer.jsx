import React from "react"
import { useDragLayer } from "react-dnd"
import * as itemTypes from "./itemTypes"

export default function Layer() {
  const { itemType, isDragging, currentOffset } = useDragLayer(monitor => ({
    itemType: monitor.getItemType(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
  }))

  const renderItem = () => {
    switch (itemType) {
      case itemTypes.INNER:
        return (
          <div
            style={{
              transform: `translate(${currentOffset.x}px, ${currentOffset.y}px)`,
            }}
          >
            Preview
          </div>
        )
      default:
        return null
    }
  }

  if (!isDragging) {
    return null
  }

  console.log(currentOffset)

  return <div style={layerStyle}>{renderItem(currentOffset)}</div>
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
