import React from "react";
import * as utils from "./utils";

const itemWidth = 3;
const itemHeight = 4;

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
  console.log(isDragging);

  return (
    <div
      draggable
      onDragStart={event => {
        return onDragStart && onDragStart(event);
      }}
      onDragEnd={onDragEnd}
      style={{
        transition: "transform .15s ease-out",
        position: "absolute",
        zIndex: 1,
        backgroundColor: isDragging ? "lightGray" : "darkcyan",
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
