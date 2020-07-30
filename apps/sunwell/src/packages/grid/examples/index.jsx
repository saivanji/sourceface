import React, { forwardRef, useState, useCallback } from "react"
import { useDrag } from "../../dnd"
import Grid, { GridProvider } from "../"

const data = {
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

const DragPreview = ({ style }) => {
  return (
    <div
      style={{
        ...style,
        cursor: "grab",
        marginLeft: -80,
        marginTop: -15,
      }}
    >
      <Box>Preview</Box>
    </div>
  )
}

const DragPlaceholder = ({ style }) => {
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

const Box = forwardRef(({ children, style }, ref) => {
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

  const onStart = useCallback(() => ({ id: "test", w: 3, h: 4 }), [])

  const onMove = useCallback((transfer, { clientX: x, clientY: y }) => {
    setPreview({
      x,
      y,
    })
  }, [])

  const onEnd = useCallback(() => setPreview(null), [])

  const ref = useDrag("box", {
    onStart,
    onMove,
    onEnd,
  })

  return (
    <div style={{ position: "relative" }}>
      <Box style={{ opacity: preview ? 0 : 1 }} ref={ref}>
        {children}
      </Box>
      {preview && (
        <Box
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
        </Box>
      )}
    </div>
  )
}

export default () => {
  const [layout, setLayout] = useState(data)

  return (
    <GridProvider>
      <div style={{ padding: 30 }}>
        <Element>First</Element>
      </div>
      <br />
      <div style={{ margin: 50, border: "1px solid #bbb" }}>
        <Grid
          rowHeight={80}
          rows={30}
          cols={14}
          layout={layout}
          onChange={setLayout}
          components={{ DragPreview, DragPlaceholder }}
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
      </div>
    </GridProvider>
  )
}
