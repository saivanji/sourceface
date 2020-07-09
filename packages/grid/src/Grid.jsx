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

        const style = { ...size, ...position };

        return (
          <>
            <Item
              key={item.key}
              style={style}
              isDragging={isDragging}
              container={container}
              onDragStart={() => setDraggingId(id)}
              onDragEnd={() => setDraggingId(null)}
            >
              {item}
            </Item>
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
