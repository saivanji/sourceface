import React, { useRef, forwardRef, useState, useEffect } from "react";
import ReactDOM from "react-dom";
import Grill from "./react-grill";
import { Provider, useDrag, useDrop } from "./react-shiftable";

// Examples:
// https://dnd-grid.duton.lu/
// https://github.com/STRML/react-grid-layout

// Definition:
// Drag preview - either original dimmed appearance, static placeholder image or colored bg (persisting dimensions) or generic card with static size. Most likely will have static size card with type of module, icon and it's slug
//  - Original dimmed appearance on drag and resize
// When drag preview reaches more than half of a cell - move it there. What if drag preview is smaller than a cell, should we move when reaching half of a preview size?
// When dragging keep original dimensions of a dragging element in a placeholder regardless how drag preview will look like
// When resizing either display a square as preview or display original element in real time

// Drag of existing element - original
// Drag from toolbox - ?
// Resize - original

// TODO:
// How custom sized drag preview behaves? Learn about overall dnd experience
// Consider creating dnd lib(what if we have 2 boards and can move items accross them? Toolbox case)
// - Have ability in grid lib to move items to a surface from a toolbox. Toolbox is essentially another grid with only one column?
//   - On leave and on enter callbacks in a grid?
// - Under the hood, grid will have the same type of item in dnd lib so it will make possible to implement drag across multiple grids
// - Try to abstract imperative code as much as possible in the lib
// - Interrupt dragging by pushing ESC key
// - multiple types support
// - Dragging multiple items at the same time
// - useDrop will accept array of types
//
// Sometimes getting an error - "Cannot destructure property 'left' of 'undefined' as it is undefined" in a "drag" function
//
// Fix the gap when when moving 2nd item to the 1st position in a 3 items stack
// Keep in mind direction of a collision(north, south, east and west)
// Search around grid collision algorithm
//
// Fix position when scrolling and dragging/resizing at the same time
// When resize collision is exactly half of an element - offset is calculated wrong
//
// On grid change - app send debounced save grid request?
// On drop from a toolbox sorting is disabled, user can only put the item on the available space. With a + placeholder?
// Grid will have other callbacks(onFinish etc) than onChange?

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

const items = [
  {
    id: "bob",
    text: "Bob",
    color: "indianred"
  },
  {
    id: "john",
    text: "John",
    color: "darkCyan"
  },
  {
    id: "mike",
    text: "Mike",
    color: "sandybrown"
  },
  {
    id: "kyle",
    text: "Kyle",
    color: "chocolate"
  },
  {
    id: "ray",
    text: "Ray",
    color: "purple"
  },
  {
    id: "tom",
    text: "Tom",
    color: "crimson"
  }
];

const data = {
  bob: {
    x: 1,
    y: 1,
    w: 1,
    h: 1,
    isDraggable: true
  },
  john: {
    x: 4,
    y: 1,
    w: 2,
    h: 3,
    isDraggable: true
  },
  mike: {
    x: 6,
    y: 2,
    w: 2,
    h: 4,
    isDraggable: true
  },
  kyle: {
    x: 3,
    y: 6,
    w: 5,
    h: 1,
    isDraggable: true
  },
  ray: {
    x: 5,
    y: 7,
    w: 3,
    h: 2,
    isDraggable: true
  },
  tom: {
    x: 10,
    y: 4,
    w: 3,
    h: 2
  }
};

const App = () => {
  const [layout, setLayout] = useState(data);

  return (
    <Grill
      rowHeight={80}
      rows={10}
      cols={14}
      layout={layout}
      onChange={setLayout}
      components={{
        DragHandle
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
    </Grill>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
