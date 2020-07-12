import { useEffect } from "react";

export default ({
  elementRef,
  nwRef,
  swRef,
  neRef,
  seRef,
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

    const args = [element, minWidth, minHeight, onResizeStart, onResizeEnd];

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
  onResizeStart,
  onResizeEnd
) => {
  node.onmousedown = e => {
    const { m41: translateX, m42: translateY } = new window.DOMMatrix(
      window.getComputedStyle(element).transform
    );

    const payload = {
      element,
      startX: e.clientX,
      startY: e.clientY,
      minWidth,
      minHeight,
      width: element.offsetWidth,
      height: element.offsetHeight,
      translateX,
      translateY
    };

    const move = e => draw(e, position, payload);

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

const draw = (
  e,
  position,
  {
    startX,
    startY,
    width,
    height,
    minWidth,
    minHeight,
    translateX,
    translateY,
    element
  }
) => {
  const deltaX = e.clientX - startX;
  const deltaY = startY - e.clientY;
  const isNorth = position === "nw" || position === "ne";
  const isWest = position === "nw" || position === "sw";

  const w = isWest ? width - deltaX : width + deltaX;
  const h = isNorth ? height + deltaY : height - deltaY;

  const x = isWest ? limit(translateX + deltaX, w, minWidth) : translateX;
  const y = isNorth ? limit(translateY - deltaY, h, minHeight) : translateY;

  element.style.width = `${biggest(w, minWidth)}px`;
  element.style.height = `${biggest(h, minHeight)}px`;

  element.style.transform = `translate(${x}px, ${y}px)`;
};

const biggest = (a, b) => (a < b ? b : a);
const smallest = (a, b) => (a < b ? a : b);

const limit = (value, size, minSize) =>
  smallest(value, value + (size - minSize));
