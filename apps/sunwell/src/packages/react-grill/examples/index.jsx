import React, { forwardRef, useState } from "react"
import Grill from "../"

const DragHandle = forwardRef(({ children }, ref) => {
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: "100%",
        height: "100%",
      }}
    >
      <div
        ref={ref}
        style={{
          position: "absolute",
          top: -20,
          left: 0,
        }}
      >
        Handle
      </div>
      {children}
    </div>
  )
})

const items = [
  {
    id: "bob",
    text: "Bob",
    color: "indianred",
  },
  {
    id: "john",
    text: "John",
    color: "darkCyan",
  },
  {
    id: "mike",
    text: "Mike",
    color: "sandybrown",
  },
  {
    id: "kyle",
    text: "Kyle",
    color: "chocolate",
  },
  {
    id: "ray",
    text: "Ray",
    color: "purple",
  },
  {
    id: "tom",
    text: "Tom",
    color: "crimson",
  },
]

const data = {
  bob: {
    x: 1,
    y: 1,
    w: 1,
    h: 1,
    isDraggable: true,
  },
  john: {
    x: 4,
    y: 1,
    w: 2,
    h: 3,
    isDraggable: true,
  },
  mike: {
    x: 6,
    y: 2,
    w: 2,
    h: 4,
    isDraggable: true,
  },
  kyle: {
    x: 3,
    y: 6,
    w: 5,
    h: 1,
    isDraggable: true,
  },
  ray: {
    x: 5,
    y: 7,
    w: 3,
    h: 2,
    isDraggable: true,
  },
  tom: {
    x: 10,
    y: 4,
    w: 3,
    h: 2,
  },
}

const First = () => {
  const [layout, setLayout] = useState(data)

  return (
    <Grill
      rowHeight={80}
      rows={10}
      cols={14}
      layout={layout}
      onChange={setLayout}
      components={{
        DragTrigger: DragHandle,
      }}
    >
      {items.map(item => (
        <div
          key={item.id}
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: item.color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              fontSize: "2rem",
            }}
          >
            {item.text}
          </span>
        </div>
      ))}
    </Grill>
  )
}

const Second = () => {
  const [layout, setLayout] = useState(data)

  return (
    <Grill
      rowHeight={80}
      rows={10}
      cols={14}
      layout={layout}
      onChange={setLayout}
      components={{
        DragTrigger: DragHandle,
      }}
    >
      {items.map(item => (
        <div
          key={item.id}
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: item.color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              fontSize: "2rem",
            }}
          >
            {item.text}
          </span>
        </div>
      ))}
    </Grill>
  )
}

export default () => {
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <div style={{ flex: 1 }}>
        <Second />
      </div>
    </div>
  )
}
