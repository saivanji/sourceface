import React, { useEffect, useState, useRef } from "react";
import Lines from "./Lines";
import Item from "./Item";
import * as utils from "./utils";

export default function Grid({
  children,
  rowHeight,
  rows,
  cols,
  layout,
  onChange,
  components
}) {
  const [customization, setCustomization] = useState();
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

        const pixelWidth = containerWidth
          ? utils.calcPixelX(width, cols, containerWidth)
          : utils.calcPercentageX(width, cols);
        const pixelHeight = utils.calcPixelY(height, rowHeight);
        const pixelX = containerWidth
          ? utils.calcPixelX(x, cols, containerWidth)
          : utils.calcPercentageX(x, cols);
        const pixelY = utils.calcPixelY(y, rowHeight);

        return (
          <Item
            key={id}
            initialLoad={!containerWidth}
            x={pixelX}
            y={pixelY}
            width={pixelWidth}
            height={pixelHeight}
            minWidth={minPixelWidth}
            minHeight={minPixelHeight}
            horizontalBoundary={containerWidth}
            verticalBoundary={containerHeight}
            customization={isCustomizing && customization}
            components={components}
            onCustomizeStart={type => {
              customizable.current = { id, ...layout[id] };
              setCustomization(type);
            }}
            onCustomizeEnd={() => {
              setCustomization(null);
              customizable.current = null;
            }}
            onCustomize={({
              w: pixelWidth,
              h: pixelHeight,
              x: pixelX,
              y: pixelY
            }) => {
              const initial = customizable.current;
              const width = pixelWidth
                ? Math.round(pixelWidth / minPixelWidth)
                : initial.width;
              const height = pixelHeight
                ? Math.round(pixelHeight / minPixelHeight)
                : initial.height;
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
            }}
          >
            {item}
          </Item>
        );
      })}
      {!!customization && containerWidth && (
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
