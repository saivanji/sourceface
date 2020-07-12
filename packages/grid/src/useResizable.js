import { useEffect } from "react";
import { getTransform } from "./dom";
import { range } from "./utils";

export default ({
  elementRef,
  nwRef,
  swRef,
  neRef,
  seRef,
  horizontalBoundary,
  verticalBoundary,
  minWidth,
  minHeight,
  onResizeStart,
  onResizeEnd
}) => {
  useEffect(() => {
    const element = elementRef.current;
    const nw = nwRef.current;
    const sw = swRef.current;
    const ne = neRef.current;
    const se = seRef.current;

    const args = [
      element,
      minWidth,
      minHeight,
      horizontalBoundary,
      verticalBoundary,
      onResizeStart,
      onResizeEnd
    ];

    const cleanup = [
      nw && listen("nw", nw, ...args),
      sw && listen("sw", sw, ...args),
      ne && listen("ne", ne, ...args),
      se && listen("se", se, ...args)
    ];

    return () => {
      for (let fn of cleanup) {
        fn && fn();
      }
    };
  }, [minWidth]);
};

const listen = (
  position,
  node,
  element,
  minWidth,
  minHeight,
  horizontalBoundary,
  verticalBoundary,
  onResizeStart,
  onResizeEnd
) => {
  node.onmousedown = e => {
    const { translateX, translateY } = getTransform(element);
    const startX = e.clientX;
    const startY = e.clientY;
    const initialWidth = element.offsetWidth;
    const initialHeight = element.offsetHeight;

    const move = e => {
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      const isNorth = position === "nw" || position === "ne";
      const isWest = position === "nw" || position === "sw";

      const [w, x] = change(
        isWest,
        deltaX,
        translateX,
        initialWidth,
        minWidth,
        horizontalBoundary
      );
      const [h, y] = change(
        isNorth,
        deltaY,
        translateY,
        initialHeight,
        minHeight,
        verticalBoundary
      );

      element.style.width = `${w}px`;
      element.style.height = `${h}px`;

      element.style.transform = `translate(${x}px, ${y}px)`;
    };

    const cleanup = e => {
      document.removeEventListener("mouseup", cleanup);
      document.removeEventListener("mousemove", move);
      onResizeEnd(e);
    };

    onResizeStart(e);
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", cleanup);
  };

  return () => {
    node.onmousedown = null;
  };
};

const change = (cond, delta, initialOffset, initialSize, minSize, boundary) => {
  if (cond) {
    return [
      range(initialSize - delta, minSize, initialSize + initialOffset),
      range(initialOffset + delta, 0, initialOffset + initialSize - minSize)
    ];
  }

  return [
    range(initialSize + delta, minSize, boundary - initialOffset),
    initialOffset
  ];
};
