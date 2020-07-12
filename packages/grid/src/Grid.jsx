import React, {
  cloneElement,
  useEffect,
  useState,
  useRef,
  useCallback
} from "react";
import Lines from "./Lines";
import Placeholder from "./Placeholder";
import * as utils from "./utils";

export default function Grid({ children, rowHeight, rows, cols, layout }) {
  const [customizingId, setCustomizingId] = useState(null);
  const [containerWidth, setContainerWidth] = useState(null);
  const containerRef = useRef();

  useEffect(() => {
    // what is offsetWidth?
    setContainerWidth(containerRef.current?.offsetWidth);
  }, [containerRef]);

  const minPixelWidth =
    containerWidth && utils.calcPixelX(1, cols, containerWidth);
  const minPixelHeight = utils.calcPixelY(1, rowHeight);

  return (
    <div ref={containerRef} style={{ position: "relative", height: 500 }}>
      {React.Children.map(children, (item, i) => {
        const id = item.key;
        const isCustomizing = customizingId === id;

        const { x, y, width, height } = layout[id];

        const size = calcSize(containerWidth, cols, rowHeight, width, height);
        const position = calcPosition(containerWidth, cols, rowHeight, x, y);

        const style = { ...size, ...position };

        return (
          <>
            {cloneElement(item, {
              style,
              containerRef,
              minWidth: minPixelWidth,
              minHeight: minPixelHeight,
              onCustomizeStart: () => setCustomizingId(id),
              onCustomizeEnd: () => setCustomizingId(null)
            })}
            {isCustomizing && <Placeholder style={style} />}
          </>
        );
      })}
      {customizingId && containerWidth && (
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
