import React, { forwardRef, useState } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Grid from "./Grid";

const items = [
  {
    id: "john",
    text: "John",
    color: "darkCyan"
  }
];

// Examples:
// https://dnd-grid.duton.lu/
// https://github.com/STRML/react-grid-layout

// Definition:
// Drag preview - either original dimmed appearance, static placeholder image or colored bg (persisting dimensions) or generic card with static size. Most likely will have static size card with type of module, icon and it's slug
//  - Original dimmed appearance on drag and resize
// When drag preview reaches more than half of a cell - move it there. What if drag preview is smaller than a cell, should we move when reaching half of a preview size?
// When dragging keep original dimensions of a dragging element in a placeholder regardless how drag preview will look like
// When resizing either display a square as preview or display original element in real time

// TODO:
// Improve imperative code in drag and resize
// Fix dragging / resizing 2nd time
// Make items resizable by default
//
// Implement moving the element over the grid(that was implemented before)
// - Consider source boundaries while drag
// - Move element only when half area was hovered
//
// Implement updating the grid in respect to drag/resize
//
// Fix position when scrolling and dragging/resizing at the same time
// Have stacking and free movement at the same time

// Consider rewriting in a declarative way?

const ResizeHandle = forwardRef(function Resize({ position }, ref) {
  const positions = {
    nw: ["top", "left"],
    sw: ["bottom", "left"],
    ne: ["top", "right"],
    se: ["bottom", "right"]
  };

  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        cursor: `${position}-resize`,
        zIndex: 3,
        width: 20,
        height: 20,
        ...positions[position].reduce((acc, key) => ({ ...acc, [key]: 0 }), {})
      }}
    />
  );
});

const DragHandle = forwardRef(({ isDragging }, ref) => {
  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        top: -20,
        left: -20
      }}
    >
      Handle
    </div>
  );
});

const App = () => {
  const [layout, setLayout] = useState({
    john: {
      x: 2,
      y: 2,
      height: 2,
      width: 2
    }
  });

  return (
    <Grid
      rowHeight={80}
      rows={10}
      cols={14}
      layout={layout}
      onChange={(id, item) => setLayout({ ...layout, [id]: item })}
      components={{
        DragHandle,
        ResizeHandle
      }}
    >
      {items.map(item => (
        <div
          key={item.id}
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            backgroundColor: item.color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <span
            style={{
              fontSize: "2rem"
            }}
          >
            {item.text}
          </span>
        </div>
      ))}
    </Grid>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
