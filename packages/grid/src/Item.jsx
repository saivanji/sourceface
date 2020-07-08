import React from "react";
import * as utils from "./utils";

const itemWidth = 1;
const itemHeight = 1;

export default function Item({
  isDragging,
  x,
  y,
  cols,
  rowHeight,
  containerWidth,
  onDragStart,
  onDragEnd
}) {
  return (
    <div
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      draggable
      style={{
        transition: "transform .15s ease-out",
        position: "absolute",
        zIndex: 1,
        backgroundColor: "darkcyan",
        height: utils.calcYCSS(itemHeight, rowHeight),
        ...(!containerWidth
          ? {
              width: utils.calcXCSSPercentage(itemWidth, cols),
              top: utils.calcYCSS(y, rowHeight),
              left: utils.calcXCSSPercentage(x, cols)
            }
          : {
              width: utils.calcXCSS(itemWidth, cols, containerWidth),
              transform: `translate(${utils.calcXCSS(
                x,
                cols,
                containerWidth
              )}px, ${utils.calcYCSS(y, rowHeight)}px)`
            })
      }}
    />
  );
}
