import { useEffect } from "react";

export default ({
  elementRef,
  nwRef,
  swRef,
  neRef,
  seRef,
  calcMinWidth,
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
    const minWidth = calcMinWidth();

    const args = [element, minWidth, minHeight, onResizeStart, onResizeEnd];

    // can not resize multiple times without refreshing the page

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
  }, []);
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
    const payload = {
      element,
      startX: e.clientX,
      startY: e.clientY,
      minWidth,
      minHeight,
      width: element.offsetWidth,
      height: element.offsetHeight,
      offsetLeft: element.offsetLeft,
      offsetTop: element.offsetTop
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
    offsetLeft,
    offsetTop,
    element
  }
) => {
  const deltaX = e.clientX - startX;
  const deltaY = startY - e.clientY;
  const isNorth = position === "nw" || position === "ne";
  const isWest = position === "nw" || position === "sw";

  const w = isWest ? width - deltaX : width + deltaX;
  const h = isNorth ? height + deltaY : height - deltaY;

  const x = isWest ? limit(offsetLeft + deltaX, w, minWidth) : offsetLeft;
  const y = isNorth ? limit(offsetTop - deltaY, h, minHeight) : offsetTop;

  element.style.width = `${biggest(w, minWidth)}px`;
  element.style.height = `${biggest(h, minHeight)}px`;

  element.style.transform = `translate(${x}px, ${y}px)`;
};

const biggest = (a, b) => (a < b ? b : a);
const smallest = (a, b) => (a < b ? a : b);

const limit = (value, size, minSize) =>
  smallest(value, value + (size - minSize));
