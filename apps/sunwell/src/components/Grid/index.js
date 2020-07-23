import React, { useState } from "react"
import Grill from "packages/react-grill"
// import styles from "./index.scss"

export default function Grid({ isEditable, children, positions }) {
  const [layout, setLayout] = useState(positions)
  return (
    <Grill
      rows={50}
      cols={10}
      rowHeight={80}
      isDraggable={isEditable}
      isResizable={isEditable}
      layout={layout}
      onChange={setLayout}
    >
      {children}
    </Grill>
  )
}
