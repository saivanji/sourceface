import React, { forwardRef, useState } from "react"
import Grill, { GrillProvider } from "../"

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

const data1 = {
  bob: {
    x: 1,
    y: 1,
    w: 1,
    h: 1,
    data: {
      text: "Bob",
      color: "indianred",
    },
  },
  john: {
    x: 4,
    y: 1,
    w: 2,
    h: 3,
    data: {
      text: "John",
      color: "darkCyan",
    },
  },
  mike: {
    x: 6,
    y: 2,
    w: 2,
    h: 4,
    data: {
      text: "Mike",
      color: "sandybrown",
    },
  },
}

const data2 = {
  kyle: {
    x: 3,
    y: 6,
    w: 5,
    h: 1,
    data: {
      text: "Kyle",
      color: "chocolate",
    },
  },
  ray: {
    x: 5,
    y: 7,
    w: 3,
    h: 2,
    data: {
      text: "Ray",
      color: "purple",
    },
  },
  tom: {
    x: 10,
    y: 4,
    w: 3,
    h: 2,
    data: {
      text: "Tom",
      color: "crimson",
    },
  },
}

const First = () => {
  const [layout, setLayout] = useState(data1)

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
      renderItem={data => (
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: data.color,
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
            {data.text}
          </span>
        </div>
      )}
    />
  )
}

const Second = () => {
  const [layout, setLayout] = useState(data2)

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
      renderItem={data => (
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: data.color,
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
            {data.text}
          </span>
        </div>
      )}
    />
  )
}

export default () => {
  return (
    <GrillProvider>
      <div style={{ display: "flex", alignItems: "center" }}>
        <div style={{ flex: 1, borderRight: "1px solid #aaa" }}>
          <First />
        </div>
        <div style={{ flex: 1 }}>
          <Second />
        </div>
      </div>
    </GrillProvider>
  )
}
