import React, { useEffect, useState, useCallback } from "react"
import Grill from "packages/react-grill"
// import styles from "./index.scss"

export default function Grid({ isEditable, children, positions, onChange }) {
  const [layout, setLayout] = useState(null)
  const onChangeWrap = useCallback(() => onChange(layout), [layout, onChange])

  useEffect(() => {
    setLayout(positions)
  }, [positions])

  return (
    <Grill
      rows={50}
      cols={10}
      rowHeight={80}
      isDraggable={isEditable}
      isResizable={isEditable}
      layout={layout || positions}
      onChange={setLayout}
      onDragEnd={onChangeWrap}
      onResizeEnd={onChangeWrap}
    >
      {children}
    </Grill>
  )
}
