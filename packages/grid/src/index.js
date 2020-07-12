import React, { forwardRef } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Grid from "./Grid";
import Item from "./Item";

const items = [
  {
    id: "john",
    text: "John",
    color: "darkCyan"
  }
];

const layout = {
  john: {
    x: 2,
    y: 2,
    height: 2,
    width: 2
  }
};

// Examples:
// https://dnd-grid.duton.lu/
// https://github.com/STRML/react-grid-layout

// Definition:
// Drag preview - either original dimmed appearance, static placeholder image or colored bg (persisting dimensions) or generic card with static size. Most likely will have static size card with type of module, icon and it's slug
// When drag preview reaches more than half of a cell - move it there. What if drag preview is smaller than a cell, should we move when reaching half of a preview size?
// When dragging keep original dimensions of a dragging element in a placeholder regardless how drag preview will look like
// When resizing either display a square as preview or display original element in real time

// TODO:
// Do not allow to resize element outside of a grid
//
// Implement moving the element over the grid(that was implemented before)
// - Consider source boundaries while drag
// - Move element only when half area was hovered
//
// Implement updating the grid in respect to drag/resize
//
// Fix position when scrolling and dragging/resizing at the same time
// Have stacking and free movement at the same time

const Resize = forwardRef(function Resize({ position }, ref) {
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
        width: 20,
        height: 20,
        ...positions[position].reduce((acc, key) => ({ ...acc, [key]: 0 }), {})
      }}
    />
  );
});

ReactDOM.render(
  <Grid rowHeight={80} rows={10} cols={14} layout={layout}>
    {items.map(item => (
      <Item key={item.id}>
        {({ handleRef, resizable }) => (
          <div
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
            <Resize ref={resizable.nwRef} position="nw" />
            <Resize ref={resizable.swRef} position="sw" />
            <Resize ref={resizable.neRef} position="ne" />
            <Resize ref={resizable.seRef} position="se" />
            <div
              style={{
                position: "absolute",
                top: -20,
                left: -20
              }}
              ref={handleRef}
            >
              Handle
            </div>
            <span
              style={{
                fontSize: "2rem"
              }}
            >
              {item.text}
            </span>
          </div>
        )}
      </Item>
    ))}
  </Grid>,
  document.getElementById("root")
);

// <>
//   <Draggable>
//     <div>Element</div>
//   </Draggable>
//   <Draggable>
//     {({ ref }) => (
//       <div>
//         <span ref={ref}>Handle</span>Element
//       </div>
//     )}
//   </Draggable>
//   <Resizable>
//     {({ tlRef, trRef, blRef, brRef }) => (
//       <div>
//         <span ref={tlRef}>tl</span>
//         <span ref={trRef}>tr</span>
//         Element
//         <span ref={blRef}>bl</span>
//         <span ref={brRef}>br</span>
//       </div>
//     )}
//   </Resizable>
// </>;
//
//
// <>
//   <Item>
//     <div>Element</div>
//   </Item>
//   <Item>
//     {({ draggable, resizable }) => (
//       <div ref={draggable.element}>
//         <span ref={resizable.tl}>tl</span>
//         <span ref={resizable.tr}>tr</span>
//         <span ref={draggable.handle}>Handle</span>Element
//         <span ref={resizable.bl}>bl</span>
//         <span ref={resizable.br}>br</span>
//       </div>
//     )}
//   </Item>
// </>;
