import React, { useState } from "react"
import Grill from "packages/react-grill"
// import styles from "./index.scss"

// will keep grid information as a column in modules table

const data = {
  1: {
    x: 1,
    y: 12,
    w: 1,
    h: 1,
  },
  2: {
    x: 4,
    y: 12,
    w: 2,
    h: 3,
  },
  3: {
    x: 6,
    y: 12,
    w: 2,
    h: 4,
  },
  4: {
    x: 0,
    y: 0,
    w: 9,
    h: 11,
  },
}

export default function Grid({ isEditable, children }) {
  const [layout, setLayout] = useState(data)
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
