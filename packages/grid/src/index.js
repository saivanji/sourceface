import React, { useState, useRef } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import * as utils from "./utils";
import Item from "./Item";
import Lines from "./Lines";

function Grid() {
  const [{ x, y }, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setDragging] = useState(false);

  const container = useRef();
  const target = useRef({ x, y });

  const rowHeight = 80;
  const rows = 10; // infinite?
  const cols = 8;

  return (
    <>
      <div
        onDragOver={e => {
          const { x, y } = target.current;
          const hoverX = utils.calcX(
            e.pageX - container.current.element.offsetLeft,
            cols,
            container.current.width
          );
          const hoverY = utils.calcY(
            e.pageY - container.current.element.offsetTop,
            rowHeight
          );

          if (hoverX === x && hoverY === y) return;

          target.current.x = hoverX;
          target.current.y = hoverY;

          setPosition({ x: hoverX, y: hoverY });
        }}
        ref={element => {
          if (!container.current && element) {
            const { width, height } = element.getBoundingClientRect();
            container.current = { width, height, element };
          }
        }}
        style={{ position: "relative", height: 500 }}
      >
        <Item
          isDragging={isDragging}
          x={x}
          y={y}
          containerWidth={container.current?.width}
          rows={rows}
          cols={cols}
          rowHeight={rowHeight}
          onDragStart={() => setDragging(true)}
          onDragEnd={() => setDragging(false)}
        />
        {isDragging && container.current && (
          <Lines
            style={{ position: "absolute", top: 0, left: 0 }}
            rows={rows}
            cols={cols}
            rowHeight={rowHeight}
            containerWidth={container.current.width}
          />
        )}
      </div>
    </>
  );
}

// TODO:
// Define UI approach of DnD
//
// Customize drag preview element
// Implement drag handle
// Define root grid component interface
//
// Consider source boundaries while drag
// Move element only when half area was hovered
//
// If draggable item is having lot of rows, limit them to a static value
//
// Have stacking and free movement at the same time

ReactDOM.render(<Grid />, document.getElementById("root"));
