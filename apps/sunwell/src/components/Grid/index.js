import React, { useState, useCallback } from "react"
import Grill from "packages/react-grill"
// import styles from "./index.scss"

export default function Grid({ isEditable, children, positions }) {
  const [layout, setLayout] = useState(positions)
  const onSave = useCallback(() => console.log(layout), [layout])

  return (
    <Grill
      rows={50}
      cols={10}
      rowHeight={80}
      isDraggable={isEditable}
      isResizable={isEditable}
      layout={layout}
      onChange={setLayout}
      onDragEnd={onSave}
      onResizeEnd={onSave}
    >
      {children}
    </Grill>
  )
}
