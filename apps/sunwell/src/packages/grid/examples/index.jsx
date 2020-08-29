import React, { forwardRef, useState } from "react"
import Grill, { GrillProvider } from "../"

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
    w: 4,
    h: 8,
    data: {
      text: "John",
      color: "darkCyan",
      layout: {
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
      },
    },
  },
}

const data2 = {
  ray: {
    x: 6,
    y: 2,
    w: 2,
    h: 4,
    data: {
      text: "Ray",
      color: "seagreen",
    },
  },
  andrew: {
    x: 3,
    y: 8,
    w: 5,
    h: 1,
    data: {
      text: "Andrew",
      color: "slategray",
    },
  },
}

const OuterItem = ({ style }) => {
  return (
    <div
      style={{
        ...style,
        backgroundColor: "skyblue",
        border: "2px dashed blue",
        transition: "all cubic-bezier(0.2, 0, 0, 1) .2s",
        borderRadius: 4,
      }}
    ></div>
  )
}

const Placeholder = ({ style }) => {
  return (
    <div
      style={{
        ...style,
        backgroundColor: "lightGray",
        transition: "all cubic-bezier(0.2, 0, 0, 1) .2s",
        borderRadius: 4,
      }}
    ></div>
  )
}

const Box = forwardRef(({ children, style }, ref) => (
  <div
    ref={ref}
    style={{
      ...style,
      transition: "all cubic-bezier(0.2, 0, 0, 1) .2s",
    }}
  >
    {children}
  </div>
))

const Card = forwardRef(({ children, style }, ref) => {
  return (
    <div
      ref={ref}
      style={{
        ...style,
        border: "1px solid #ddd",
        background: "#fff",
        borderRadius: 3,
        padding: 10,
        width: 200,
      }}
    >
      {children}
    </div>
  )
})

export default () => {
  return (
    <GrillProvider>
      <div
        style={{
          display: "flex",
          height: 900,
        }}
      >
        <Area data={data1} />
        <Area data={data2} />
      </div>
    </GrillProvider>
  )
}

const Area = ({ data, style, cols = 10, rows = 30, rowHeight = 80 }) => {
  const [layout, setLayout] = useState(data)
  const handleChange = event => setLayout(event.layout)

  return (
    <div
      style={{
        border: "1px solid #bbb",
        flex: 1,
        margin: 5,
      }}
    >
      <Grill
        style={{ width: "100%", ...style }}
        rowHeight={rowHeight}
        cols={cols}
        rows={rows}
        layout={layout}
        renderItem={data =>
          !data.layout ? (
            <div
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: data.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                userSelect: "none",
              }}
            >
              <span
                style={{
                  fontSize: "1.5rem",
                }}
              >
                {data.text}
              </span>
            </div>
          ) : (
            <div style={{ backgroundColor: "#fff", border: "1px solid #aaa" }}>
              <Area data={data.layout} cols={18} rows={20} rowHeight={30} />
            </div>
          )
        }
        onChange={handleChange}
        components={{
          Box,
          OuterItem,
          DragPlaceholder: Placeholder,
          ResizePlaceholder: Placeholder,
        }}
      />
    </div>
  )
}
