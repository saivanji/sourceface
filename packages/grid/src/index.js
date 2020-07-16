import React, { forwardRef, useState } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Grid from "./Grid";

import { useRef } from "react";
import { Provider, useDrag, useDrop } from "./lib";

const avatars = [
  "https://i.pravatar.cc/150?img=1",
  "https://i.pravatar.cc/150?img=2",
  "https://i.pravatar.cc/150?img=3",
  "https://i.pravatar.cc/150?img=4",
  "https://i.pravatar.cc/150?img=5"
];

// TODO: Fix z-index issue
const Drag = () => {
  const triggerRef = useRef();
  const previewRef = useRef();

  const [isDragging, setDragging] = useState(false);

  useDrag(triggerRef, previewRef, "box", {
    onStart: () => {
      setDragging(true);
    },
    onEnd: () => {
      setDragging(false);
    }
  });

  return (
    <div
      ref={previewRef}
      style={{ transform: !isDragging ? "none" : "rotate(-5deg)" }}
    >
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin a accumsan
      mauris, et laoreet purus. Vestibulum ante ipsum primis in faucibus orci
      luctus et ultrices posuere cubilia curae; Nullam finibus, massa eget
      elementum accumsan, elit leo tincidunt quam, sed tincidunt ante augue et
      tortor. Pellentesque ut lectus sed nunc facilisis pretium vel sed arcu.
      Vivamus erat risus, consequat eget neque et, placerat placerat felis.
      Donec eget hendrerit elit, ultricies pretium libero. Sed non erat ex.
      <div ref={triggerRef}>Drag me</div>
    </div>
  );
};

// <div style={{ position: "relative" }}>
//   <div style={{ opacity: isDragging ? 0.3 : 1 }}>
//     Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin a
//     accumsan mauris, et laoreet purus. Vestibulum ante ipsum primis in
//     faucibus orci luctus et ultrices posuere cubilia curae; Nullam finibus,
//     massa eget elementum accumsan, elit leo tincidunt quam, sed tincidunt
//     ante augue et tortor. Pellentesque ut lectus sed nunc facilisis pretium
//     vel sed arcu. Vivamus erat risus, consequat eget neque et, placerat
//     placerat felis. Donec eget hendrerit elit, ultricies pretium libero. Sed
//     non erat ex.
//     <div ref={triggerRef}>Drag me</div>
//   </div>
//   {isDragging && (
//     <div style={{ top: 0, left: 0, position: "absolute" }} ref={previewRef}>
//       Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin a
//       accumsan mauris, et laoreet purus. Vestibulum ante ipsum primis in
//       faucibus orci luctus et ultrices posuere cubilia curae; Nullam
//       finibus, massa eget elementum accumsan, elit leo tincidunt quam, sed
//       tincidunt ante augue et tortor. Pellentesque ut lectus sed nunc
//       facilisis pretium vel sed arcu. Vivamus erat risus, consequat eget
//       neque et, placerat placerat felis. Donec eget hendrerit elit,
//       ultricies pretium libero. Sed non erat ex.
//       <div>Drag me</div>
//     </div>
//   )}
// </div>

const Avatar = ({ src }) => {
  const ref = useRef();

  const [isDragging, setDragging] = useState(false);

  useDrag(ref, "avatar", {
    onStart: () => {
      setDragging(true);

      return { src };
    },
    onEnd: () => {
      console.log("drag end");
      setDragging(false);
    }
  });

  return (
    <img
      style={{ transform: !isDragging ? "none" : "rotate(-5deg)", margin: 5 }}
      draggable={false}
      alt="avatar"
      ref={ref}
      src={src}
    />
  );
};

const Drop = () => {
  const [isOver, setOver] = useState();
  const [items, setItems] = useState([]);
  const targetRef = useRef();

  useDrop(targetRef, ["box", "avatar"], {
    onDrop: ({ src }) => {
      setOver(false);
      setItems([...items, src]);
      console.log("drop", src);
    },
    onHover: () => {
      console.log("hover");
    },
    onEnter: () => {
      setOver(true);
      console.log("enter");
    },
    onLeave: () => {
      setOver(false);
      console.log("leave");
    }
  });

  return (
    <div
      ref={targetRef}
      style={{
        border: "1px dashed gray",
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        justifyContent: "center",
        backgroundColor: !isOver ? "transparent" : "aquamarine",
        marginTop: 30,
        padding: 10,
        minHeight: 200
      }}
    >
      {!items.length
        ? "Drop here"
        : items.map((src, i) => <img key={i} alt="avatar" src={src} />)}
    </div>
  );
};

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
// Rename "drag" motion type to "move"
// Consider creating dnd lib(what if we have 2 boards and can move items accross them? Toolbox case)
// - Have ability in grid lib to move items to a surface from a toolbox. Toolbox is essentially another grid with only one column.
//   - On leave and on enter callbacks in a grid?
// - Under the hood, grid will have the same type of item in dnd lib so it will make possible to implement drag across multiple grids
// - Try to abstract imperative code as much as possible in the lib
// - Interrupt dragging by pushing ESC key
// - multiple types support
// - Dragging multiple items at the same time
// - useDrop will accept array of types
//
// Fix the gap when when moving 2nd item to the 1st position in a 3 items stack
// Keep in mind direction of a collision(north, south, east and west)
// Search around grid collision algorithm
//
// Fix position when scrolling and dragging/resizing at the same time
// When resize collision is exactly half of an element - offset is calculated wrong

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
    <Grid
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

ReactDOM.render(
  <Provider>
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      {avatars.map((src, i) => (
        <Avatar key={i} src={src} />
      ))}
    </div>
    <Drop />
  </Provider>,
  document.getElementById("root")
);
