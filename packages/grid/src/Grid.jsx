import React, { cloneElement, useEffect, useState, useRef } from "react";
import Lines from "./Lines";
import Placeholder from "./Placeholder";
import * as utils from "./utils";

export default function Grid({
  children,
  rowHeight,
  rows,
  cols,
  layout,
  onChange
}) {
  const [isCustomizing, setCustomizing] = useState(false);
  const [containerWidth, setContainerWidth] = useState(null);
  const customizable = useRef(null);
  const containerRef = useRef();

  useEffect(() => {
    // what is offsetWidth?
    setContainerWidth(containerRef.current?.offsetWidth);
  }, [containerRef]);

  const minPixelWidth =
    containerWidth && utils.calcPixelX(1, cols, containerWidth);
  const minPixelHeight = utils.calcPixelY(1, rowHeight);
  const containerHeight = minPixelHeight * rows;

  return (
    <div
      ref={containerRef}
      style={{ position: "relative", height: containerHeight }}
    >
      {React.Children.map(children, (item, i) => {
        const id = item.key;
        const isCustomizing = customizable.current?.id === id;

        const { x, y, width, height } = layout[id];

        const size = calcSize(containerWidth, cols, rowHeight, width, height);
        const position = calcPosition(containerWidth, cols, rowHeight, x, y);

        const style = { ...size, ...position };

        return (
          <>
            {cloneElement(item, {
              style: !isCustomizing ? style : {},
              minWidth: minPixelWidth,
              minHeight: minPixelHeight,
              horizontalBoundary: containerWidth,
              verticalBoundary: containerHeight,
              onCustomizeStart: () => {
                customizable.current = { id, ...layout[id] };
                setCustomizing(true);
              },
              onCustomizeEnd: () => {
                setCustomizing(false);
                customizable.current = null;
              },
              onCustomize: (pixelWidth, pixelHeight, pixelX, pixelY) => {
                const initial = customizable.current;
                const width = Math.round(pixelWidth / minPixelWidth);
                const height = Math.round(pixelHeight / minPixelHeight);
                const x = Math.round(pixelX / minPixelWidth);
                const y = Math.round(pixelY / minPixelHeight);

                if (
                  width === initial.width &&
                  height === initial.height &&
                  x === initial.x &&
                  y === initial.y
                )
                  return;

                const updated = {
                  width,
                  height,
                  x,
                  y
                };

                Object.assign(customizable.current, updated);

                onChange(initial.id, updated);
              }
            })}
            {isCustomizing && <Placeholder style={style} />}
          </>
        );
      })}
      {isCustomizing && containerWidth && (
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

const calcSize = (containerWidth, cols, rowHeight, width, height) => {
  const pixelHeight = utils.calcPixelY(height, rowHeight);
  const pixelWidth =
    containerWidth && utils.calcPixelX(width, cols, containerWidth);

  return {
    width: pixelWidth || utils.calcPercentageX(width, cols),
    height: pixelHeight
  };
};

const calcPosition = (containerWidth, cols, rowHeight, x, y) => {
  const pixelX = containerWidth && utils.calcPixelX(x, cols, containerWidth);
  const pixelY = utils.calcPixelY(y, rowHeight);

  return !pixelX
    ? {
        left: utils.calcPercentageX(x, cols),
        top: pixelY
      }
    : {
        transform: `translate(${pixelX}px, ${pixelY}px)`
      };
};
