import React, { cloneElement, useState, useRef } from "react";
import Lines from "./Lines";
import Placeholder from "./Placeholder";
import * as utils from "./utils";

export default function Grid({ children, rowHeight, rows, cols, layout }) {
  const [draggingId, setDraggingId] = useState(null);
  const containerRef = useRef();
  const containerWidth = containerRef.current?.offsetWidth;

  return (
    <div ref={containerRef} style={{ position: "relative", height: 500 }}>
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

        const style = { ...size, ...position };

        return (
          <>
            {cloneElement(item, {
              style,
              containerRef,
              onDragStart: () => setDraggingId(id),
              onDragEnd: () => setDraggingId(null)
            })}
            {isDragging && <Placeholder style={style} />}
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
