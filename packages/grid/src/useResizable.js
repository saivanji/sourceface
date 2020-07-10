import { useEffect } from "react";

export default ({
  containerRef,
  elementRef,
  nwRef,
  swRef,
  neRef,
  seRef,
  // minWidth = 100,
  // minHeight,
  onResizeStart,
  onResizeEnd
}) => {
  useEffect(() => {
    const { offsetLeft, offsetTop } = containerRef.current;
    const element = elementRef.current;
    // const nw = nwRef.current;
    // const sw = swRef.current;
    const ne = neRef.current;
    const se = seRef.current;

    // wrong resize on scroll
    // - take scroll into the account
    // dimensions are wrecked on customize end

    const cleanNe =
      ne &&
      resize(
        ne,
        element,
        (e, { left, top, height }) => {
          const w = e.clientX - left;
          const h = top + height - e.clientY;
          const x = left;
          const y = limit(top - (top - e.clientY), top) + window.scrollY;

          element.style.width = `${w}px`;
          element.style.height = `${h}px`;
          element.style.transform = `translate(${x - offsetLeft}px, ${
            y - offsetTop
          }px)`;
        },
        onResizeStart,
        onResizeEnd
      );

    const cleanSe =
      se &&
      resize(
        se,
        element,
        (e, { left, top }) => {
          const w = e.clientX - left;
          const h = e.clientY - top;

          element.style.width = `${w}px`;
          element.style.height = `${h}px`;
        },
        onResizeStart,
        onResizeEnd
      );

    return () => {
      cleanNe && cleanNe();
      cleanSe && cleanSe();
    };
  }, []);
};

const resize = (node, element, onResize, onResizeStart, onResizeEnd) => {
  node.onmousedown = e => {
    const rect = element.getBoundingClientRect();
    const move = e => onResize(e, rect);

    const cleanup = e => {
      document.removeEventListener("mouseup", cleanup);
      document.removeEventListener("mousemove", move);
      onResizeEnd(e, rect);
    };

    onResizeStart(e, rect);
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", cleanup);
  };

  return () => {
    node.onmousedown = null;
  };
};

const limit = (a, b) => (a > b ? b : a);
