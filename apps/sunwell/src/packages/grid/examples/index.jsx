import React, { forwardRef, useState } from "react"
import { useDrag } from "react-dnd"
import Grill, { GrillProvider, SORTABLE_OUTER } from "../"

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
    h: 7,
    data: {
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
        nick: {
          x: 1,
          y: 8,
          w: 12,
          h: 8,
          data: {
            color: "white",
            layout: {
              sam: {
                x: 1,
                y: 1,
                w: 4,
                h: 4,
                data: {
                  text: "Sam",
                  color: "darkCyan",
                },
              },
            },
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

function OuterItem({ style }) {
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

function Placeholder({ style }) {
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

const Box = forwardRef(function CustomBox({ children, style }, ref) {
  return (
    <div
      ref={ref}
      style={{
        ...style,
        transition: "all cubic-bezier(0.2, 0, 0, 1) .2s",
      }}
    >
      {children}
    </div>
  )
})

const Card = forwardRef(function Card({ children }, ref) {
  return (
    <div
      ref={ref}
      style={{
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

function Pane() {
  const [, connect] = useDrag({
    item: {
      type: SORTABLE_OUTER,
      id: "custom",
      unit: {
        w: 3,
        h: 4,
        data: {
          text: "Test",
          color: "indianred",
        },
      },
    },
  })

  return (
    <div style={{ margin: "10px 0", padding: 5 }}>
      <Card ref={connect}>Custom item</Card>
    </div>
  )
}

export default () => {
  return (
    <GrillProvider>
      <Pane />
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
            <div
              style={{
                backgroundColor: "#fff",
                border: "1px solid #aaa",
                height: "100%",
                overflowY: "auto",
              }}
            >
              <Area data={data.layout} cols={18} rows={20} rowHeight={30} />
            </div>
          )
        }
        onChange={handleChange}
        components={{
          Box,
          OuterItem,
          SortPlaceholder: Placeholder,
          ResizePlaceholder: Placeholder,
        }}
      />
    </div>
  )
}
