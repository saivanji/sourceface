import { useEffect } from "react";
import { getTransform, drag } from "./dom";
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
  onResizeEnd,
  onResize
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
      onResizeEnd,
      onResize
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
  onResizeEnd,
  onResize
) => {
  return drag(
    node,
    e => {
      const { translateX: initialX, translateY: initialY } = getTransform(
        element
      );

      // TODO: instead of getting offsets and sizes from html node, get them as arguments of hook from parent component
      const initial = {
        initialX,
        initialY,
        initialWidth: element.offsetWidth,
        initialHeight: element.offsetHeight,
        startX: e.clientX,
        startY: e.clientY
      };

      onResizeStart();

      return initial;
    },
    onResizeEnd,
    (
      e,
      { initialX, initialY, initialWidth, initialHeight, startX, startY }
    ) => {
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      const isNorth = position === "nw" || position === "ne";
      const isWest = position === "nw" || position === "sw";

      const [w, x] = change(
        isWest,
        deltaX,
        initialX,
        initialWidth,
        minWidth,
        horizontalBoundary
      );
      const [h, y] = change(
        isNorth,
        deltaY,
        initialY,
        initialHeight,
        minHeight,
        verticalBoundary
      );

      element.style.width = `${w}px`;
      element.style.height = `${h}px`;
      element.style.transform = `translate(${x}px, ${y}px)`;

      onResize(w, h, x, y);
    }
  );
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
