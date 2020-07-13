import React, { forwardRef, useState } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Grid from "./Grid";

const items = [
  {
    id: "john",
    text: "John",
    color: "darkCyan"
  },
  {
    id: "mike",
    text: "Mike",
    color: "sandybrown"
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
// How custom sized drag preview behaves?
//
// Implement updating the grid in respect to drag/resize
//
// Fix position when scrolling and dragging/resizing at the same time
// Have stacking and free movement at the same time

const DragHandle = forwardRef(({ isDragging }, ref) => {
  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        top: -20,
        left: 0
      }}
    >
      Handle
    </div>
  );
});

const data = {
  john: {
    x: 2,
    y: 2,
    height: 2,
    width: 2,
    isDraggable: true
  },
  mike: {
    x: 6,
    y: 2,
    height: 2,
    width: 2,
    isDraggable: true
  }
};

const App = () => {
  const [layout, setLayout] = useState(data);

  return (
    <Grid
      rowHeight={80}
      rows={10}
      cols={14}
      layout={layout}
      onChange={layout => setLayout(layout)}
      components={{
        DragHandle
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
