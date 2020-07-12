import { useEffect } from "react";
import { getTransform } from "./dom";
import { range } from "./utils";

export default ({
  elementRef,
  handleRef,
  horizontalBoundary,
  verticalBoundary,
  onDragStart,
  onDragEnd,
  onDrag
}) => {
  useEffect(() => {
    const handle = handleRef.current;
    const element = elementRef.current;

    if (handle) {
      handle.onmousedown = e => {
        if (e.which !== 1) return;

        handle.style.cursor = "grabbing";

        const startX = e.clientX;
        const startY = e.clientY;
        const width = element.offsetWidth;
        const height = element.offsetHeight;
        const { translateX, translateY } = getTransform(element);

        const move = e => {
          const deltaX = e.clientX - startX;
          const deltaY = startY - e.clientY;
          const x = range(translateX + deltaX, 0, horizontalBoundary - width);
          const y = range(translateY - deltaY, 0, verticalBoundary - height);

          element.style.transform = `translate(${x}px, ${y}px)`;

          onDrag(width, height, x, y);
        };

        const cleanup = () => {
          document.removeEventListener("mouseup", cleanup);
          document.removeEventListener("mousemove", move);
          handle.style.cursor = "";
          onDragEnd();
        };

        onDragStart();
        document.addEventListener("mousemove", move);
        document.addEventListener("mouseup", cleanup);
      };
    }

    return () => {
      handle.onmousedown = null;
    };
  }, [horizontalBoundary]);
};
