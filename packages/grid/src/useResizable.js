import { useEffect } from "react";

export default ({
  elementRef,
  nwRef,
  swRef,
  neRef,
  seRef,
  onResizeStart,
  onResizeEnd
}) => {
  useEffect(() => {
    const element = elementRef.current;
    const nw = nwRef.current;
    const sw = swRef.current;
    const ne = neRef.current;
    const se = seRef.current;

    // dimensions are wrecked on customize end
    // limit height and width
    // can not resize multiple times without refreshing the page

    const cleanup = [
      nw && resize(nw, element, "nw", onResizeStart, onResizeEnd),
      sw && resize(sw, element, "sw", onResizeStart, onResizeEnd),
      ne && resize(ne, element, "ne", onResizeStart, onResizeEnd),
      se && resize(se, element, "se", onResizeStart, onResizeEnd)
    ];

    return () => {
      for (let fn of cleanup) {
        fn && fn();
      }
    };
  }, []);
};

const resize = (node, element, position, onResizeStart, onResizeEnd) => {
  node.onmousedown = e => {
    const payload = {
      element,
      startX: e.clientX,
      startY: e.clientY,
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

const limit = (a, b) => (a > b ? b : a);

const draw = (
  e,
  position,
  { startX, startY, width, height, offsetLeft, offsetTop, element }
) => {
  const deltaX = e.clientX - startX;
  const deltaY = startY - e.clientY;

  const w =
    position === "nw" || position === "sw" ? width - deltaX : width + deltaX;
  const h =
    position === "nw" || position === "ne" ? height + deltaY : height - deltaY;

  const x =
    position === "nw" || position === "sw" ? offsetLeft + deltaX : offsetLeft;
  const y =
    position === "nw" || position === "ne" ? offsetTop - deltaY : offsetTop;

  element.style.width = `${w}px`;
  element.style.height = `${h}px`;

  element.style.transform = `translate(${x}px, ${y}px)`;
};
