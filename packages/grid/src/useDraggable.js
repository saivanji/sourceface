import { useEffect } from "react";
import { getTransform } from "./dom";

export default ({ handleRef, elementRef, onDragStart, onDragEnd }) => {
  useEffect(() => {
    const handle = handleRef.current;
    const element = elementRef.current;

    if (handle) {
      handle.onmousedown = e => {
        if (e.which !== 1) return;

        handle.style.cursor = "grabbing";

        const startX = e.clientX;
        const startY = e.clientY;
        const { translateX, translateY } = getTransform(element);

        const move = e => {
          const deltaX = e.clientX - startX;
          const deltaY = startY - e.clientY;
          const x = translateX + deltaX;
          const y = translateY - deltaY;

          element.style.transform = `translate(${x}px, ${y}px)`;
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
  }, []);
};
