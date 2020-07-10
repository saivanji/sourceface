import React from "react";
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
    x: 1,
    y: 2,
    height: 1,
    width: 1
  }
};

// Examples:
// https://dnd-grid.duton.lu/
// https://github.com/STRML/react-grid-layout

// Definition:
// Drag preview - either original dimmed appearance, static placeholder image or colored bg (persisting dimensions) or generic card with static size. Most likely will have static size card with type of module
// When drag preview reaches more than half of a cell - move it there. What if drag preview is smaller than a cell, should we move when reaching half of a preview size?
// When dragging keep original dimensions of a dragging element in a placeholder regardless how drag preview will look like

// TODO:
// Implement drag handle
//
// Consider source boundaries while drag
// Move element only when half area was hovered
//
// Have stacking and free movement at the same time

ReactDOM.render(
  <Grid rowHeight={80} rows={10} cols={8} layout={layout}>
    {items.map(item => (
      <Item key={item.id}>
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: item.color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "2rem"
          }}
        >
          {item.text}
        </div>
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
