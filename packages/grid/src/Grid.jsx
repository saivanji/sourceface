import React, { useState, useRef, useEffect } from "react";
import Item from "./Item";
import Lines from "./Lines";
import Placeholder from "./Placeholder";
import * as utils from "./utils";

export default function Grid({ children, rowHeight, rows, cols, layout }) {
  const [draggingId, setDraggingId] = useState(null);
  const container = useRef();
  const containerWidth = container.current?.offsetWidth;

  return (
    <div ref={container} style={{ position: "relative", height: 500 }}>
      {React.Children.map(children, (item, i) => {
        const id = item.key;
        const isDragging = draggingId === id;
        const { x, y, width, height } = layout[id];

        const pixelHeight = utils.calcPixelY(height, rowHeight);
        const pixelY = utils.calcPixelY(y, rowHeight);
        const pixelWidth =
          containerWidth && utils.calcPixelX(width, cols, containerWidth);
        const pixelX =
          containerWidth && utils.calcPixelX(x, cols, containerWidth);

        const size = calcSize(cols, width, pixelWidth, pixelHeight);
        const position = calcPosition(cols, x, pixelX, pixelY);

        return (
          <>
            <Item
              {...layout[id]}
              key={item.key}
              style={{
                ...size,
                ...position
              }}
              onDrag={e => {
                const x =
                  e.pageX - (e.clientX - e.target.getBoundingClientRect().left);
                const y =
                  e.pageY - (e.clientY - e.target.getBoundingClientRect().top);

                // const cursorX = e.pageX - container.current?.offsetLeft;
                // const cursorY = e.pageY - container.current?.offsetTop;
                // // not allowing drag outside of a grid
                // if (cursorX < 0 || cursorY < 0) return;
                // const x = pixelX;
                // const y = pixelY;
                e.target.style.transform = `translate(${x}px, ${y}px)`;
              }}
              onDragStart={e => {
                // console.log("start");
                setDraggingId(id);
              }}
              onDragEnd={e => {
                // console.log("end");
                // e.target.style.transform = position.transform;
                setDraggingId(null);
              }}
            >
              {item}
            </Item>
            {isDragging && <Placeholder style={{ ...size, ...position }} />}
          </>
        );
      })}
      {draggingId && containerWidth && (
        <Lines
          style={{ position: "absolute", top: 0, left: 0 }}
          rows={rows}
          cols={cols}
          rowHeight={rowHeight}
          containerWidth={containerWidth}
        />
      )}
    </div>
  );
}

const calcSize = (cols, width, pixelWidth, pixelHeight) => ({
  width: pixelWidth || utils.calcPercentageX(width, cols),
  height: pixelHeight
});

const calcPosition = (cols, x, pixelX, pixelY) =>
  !pixelX
    ? {
        left: utils.calcPercentageX(x, cols),
        top: pixelY
      }
    : {
        transform: `translate(${pixelX}px, ${pixelY}px)`
      };
