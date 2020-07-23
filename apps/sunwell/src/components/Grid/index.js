import React, { useState } from "react"
import Grill from "packages/react-grill"
// import styles from "./index.scss"

// will keep grid information as a column in modules table

const data = {
  1: {
    x: 1,
    y: 1,
    w: 1,
    h: 1,
    isDraggable: true,
  },
  2: {
    x: 4,
    y: 1,
    w: 2,
    h: 3,
    isDraggable: true,
  },
  3: {
    x: 6,
    y: 2,
    w: 2,
    h: 4,
    isDraggable: true,
  },
  4: {
    x: 3,
    y: 6,
    w: 5,
    h: 1,
    isDraggable: true,
  },
}

export default function Grid({ isEditable, children }) {
  const [layout, setLayout] = useState(data)
  // Temp props:
  return (
    <Grill
      rows={10}
      cols={10}
      rowHeight={80}
      layout={layout}
      onChange={setLayout}
    >
      {children}
    </Grill>
  )
}
