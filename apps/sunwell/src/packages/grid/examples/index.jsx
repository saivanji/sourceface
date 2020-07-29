import React, { useState } from "react"
import Grid from "../"

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

const DragPreview = () => {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        background: "#fff",
        borderRadius: 3,
        padding: 10,
        width: 200,
        transform: "translate(-80px, -15px)",
        cursor: "grab",
      }}
    >
      Preview
    </div>
  )
}

const Root = () => {
  const [layout, setLayout] = useState(data)

  return (
    <Grid
      rowHeight={80}
      rows={10}
      cols={14}
      layout={layout}
      onChange={setLayout}
      components={{ DragPreview }}
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
    <div style={{ margin: 100 }}>
      <Root />
    </div>
  )
}
