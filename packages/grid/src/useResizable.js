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

    const payload = {
      startX: e.clientX,
      startY: e.clientY,
      minWidth,
      minHeight,
      horizontalBoundary,
      verticalBoundary,
      initialWidth: element.offsetWidth,
      initialHeight: element.offsetHeight,
      initialX: translateX,
      initialY: translateY
    };

    const move = e => render(element, calculate(e, position, payload));

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

const calculate = (
  e,
  position,
  {
    startX,
    startY,
    initialWidth,
    initialHeight,
    minWidth,
    minHeight,
    horizontalBoundary,
    verticalBoundary,
    initialX,
    initialY
  }
) => {
  const deltaX = e.clientX - startX;
  const deltaY = startY - e.clientY;
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
    -deltaY,
    initialY,
    initialHeight,
    minHeight,
    verticalBoundary
  );

  return [w, h, x, y];
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

const render = (element, [w, h, x, y]) => {
  element.style.width = `${w}px`;
  // biggest(h, minHeight)
  element.style.height = `${h}px`;

  element.style.transform = `translate(${x}px, ${y}px)`;
};
