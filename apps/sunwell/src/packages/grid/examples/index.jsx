import React, { forwardRef, useState, useCallback } from "react"
import { useDrag } from "../../dnd"
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
    w: 2,
    h: 3,
    data: {
      text: "John",
      color: "darkCyan",
    },
  },
}

const data2 = {
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
}

const data3 = {
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
    x: 3,
    y: 4,
    w: 3,
    h: 2,
    data: {
      text: "Tom",
      color: "crimson",
    },
  },
}

// const data = {
//   bob: {
//     x: 1,
//     y: 1,
//     w: 1,
//     h: 1,
//     data: {
//       text: "Bob",
//       color: "indianred",
//     },
//   },
//   john: {
//     x: 4,
//     y: 1,
//     w: 2,
//     h: 3,
//     data: {
//       text: "John",
//       color: "darkCyan",
//     },
//   },
//   mike: {
//     x: 6,
//     y: 2,
//     w: 2,
//     h: 4,
//     data: {
//       text: "Mike",
//       color: "sandybrown",
//     },
//   },
//   kyle: {
//     x: 3,
//     y: 6,
//     w: 5,
//     h: 1,
//     data: {
//       text: "Kyle",
//       color: "chocolate",
//     },
//   },
//   ray: {
//     x: 5,
//     y: 7,
//     w: 3,
//     h: 2,
//     data: {
//       text: "Ray",
//       color: "purple",
//     },
//   },
//   tom: {
//     x: 10,
//     y: 4,
//     w: 3,
//     h: 2,
//     data: {
//       text: "Tom",
//       color: "crimson",
//     },
//   },
// }

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

const Element = ({ children }) => {
  const [preview, setPreview] = useState(null)

  const handleStart = useCallback(
    () => ({
      id: "test",
      unit: {
        w: 3,
        h: 4,
        data: {
          text: "Test",
          color: "indianred",
        },
      },
    }),
    []
  )

  const handleMove = useCallback((transfer, { clientX: x, clientY: y }) => {
    setPreview({
      x,
      y,
    })
  }, [])

  const handleEnd = useCallback(() => setPreview(null), [])

  const ref = useDrag("outer", {
    onStart: handleStart,
    onMove: handleMove,
    onEnd: handleEnd,
  })

  return (
    <div style={{ position: "relative" }}>
      <Card style={{ opacity: preview ? 0 : 1 }} ref={ref}>
        {children}
      </Card>
      {preview && (
        <Card
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            transform: `translate(${preview.x}px, ${preview.y}px)`,
            cursor: "grab",
            zIndex: 11111,
            pointerEvents: "none",
          }}
        >
          {children}
        </Card>
      )}
    </div>
  )
}

export default () => {
  return (
    <GrillProvider>
      <div style={{ padding: 30 }}>
        <Element>First</Element>
      </div>
      <br />
      <div
        style={{
          display: "flex",
          margin: 50,
          border: "1px solid #bbb",
          height: 400,
          overflowY: "auto",
        }}
      >
        <Area data={data1} style={{ borderRight: "1px solid #bbb" }} />
        <Area data={data2} style={{ borderRight: "1px solid #bbb" }} />
        <Area data={data3} />
      </div>
    </GrillProvider>
  )
}

const Area = ({ data, style }) => {
  const [layout, setLayout] = useState(data)
  const handleChange = event => setLayout(event.layout)

  return (
    <Grill
      style={{ width: "33.3%", ...style }}
      rowHeight={80}
      rows={30}
      cols={10}
      layout={layout}
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
      onChange={handleChange}
      components={{
        Box,
        OuterItem,
        DragPlaceholder: Placeholder,
        ResizePlaceholder: Placeholder,
      }}
    />
  )
}
