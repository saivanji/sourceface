import React, { useState, useRef } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import * as utils from "./utils";
import Item from "./Item";
import Lines from "./Lines";
import Grid from "./Grid";

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
    height: 3,
    width: 2
  }
};

// function Grid() {
//   const [{ x, y }, setPosition] = useState({ x: 0, y: 0 });
//   const [isDragging, setDragging] = useState(false);

//   const container = useRef();
//   const target = useRef({ x, y });

//   const rowHeight = 80;
//   const rows = 10; // infinite?
//   const cols = 8;
//   const containerWidth = container.current?.width;

//   return (
//     <>
//       <div
//         onDragOver={e => {
//           const { x, y } = target.current;
//           const hoverX = utils.calcX(
//             e.pageX - container.current.element.offsetLeft,
//             cols,
//             container.current.width
//           );
//           const hoverY = utils.calcY(
//             e.pageY - container.current.element.offsetTop,
//             rowHeight
//           );

//           if (hoverX === x && hoverY === y) return;

//           target.current.x = hoverX;
//           target.current.y = hoverY;

//           setPosition({ x: hoverX, y: hoverY });
//         }}
//         ref={element => {
//           if (!container.current && element) {
//             const { width, height } = element.getBoundingClientRect();
//             container.current = { width, height, element };
//           }
//         }}
//         style={{ position: "relative", height: 500 }}
//       >
//         <Item
//           style={{
//             height: utils.calcYCSS(item.height, rowHeight),
//             width: !containerWidth
//               ? utils.calcXCSSPercentage(item.width, cols)
//               : utils.calcXCSS(item.width, cols, containerWidth),
//             ...(!isDragging &&
//               (!containerWidth
//                 ? {
//                     top: utils.calcYCSS(y, rowHeight),
//                     left: utils.calcXCSSPercentage(x, cols)
//                   }
//                 : {
//                     transform: `translate(${utils.calcXCSS(
//                       x,
//                       cols,
//                       containerWidth
//                     )}px, ${utils.calcYCSS(y, rowHeight)}px)`
//                   }))
//           }}
//           onDrag={e => {
//             e.target.style.transform = `translate(${
//               e.pageX - container.current.element.offsetLeft
//             }px, ${e.pageY - container.current.element.offsetTop}px)`;
//             console.log(e.target.style.transform);
//           }}
//           onDragStart={() => setDragging(true)}
//           onDragEnd={e => {
//             e.target.style.transform = "";
//             setDragging(false);
//           }}
//         />
//       </div>
//     </>
//   );
// }
// Definition:
// Drag preview - either original dimmed appearance, static placeholder image or colored bg (persisting dimensions) or generic card with static size. Most likely will have static size card with type of module
// When drag preview reaches more than half of a cell - move it there
// When dragging keep original dimensions of a dragging element in a placeholder regardless how drag preview will look like

// TODO:
// Custom drag preview element
// Implement drag handle
// Define root grid component interface
//
// Consider source boundaries while drag
// Move element only when half area was hovered
//
// Have stacking and free movement at the same time

ReactDOM.render(
  <Grid rowHeight={80} rows={10} cols={8} layout={layout}>
    {items.map(item => (
      <div
        key={item.id}
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
    ))}
  </Grid>,
  document.getElementById("root")
);
