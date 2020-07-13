import { useEffect } from "react";
import { getTransform } from "./dom";
import { range } from "./utils";
import { drag } from "./dom";

export default ({
  previewRef,
  handleRef,
  horizontalBoundary,
  verticalBoundary,
  onDragStart,
  onDragEnd,
  onDrag
}) => {
  useEffect(() => {
    const handle = handleRef.current;
    const preview = previewRef.current;

    return drag(
      handle,
      e => {
        handle.style.cursor = "grabbing";

        const initial = {
          startX: e.clientX,
          startY: e.clientY,
          width: preview.offsetWidth,
          height: preview.offsetHeight,
          ...getTransform(preview)
        };

        onDragStart();

        return initial;
      },
      () => {
        handle.style.cursor = "";
        onDragEnd();
      },
      (e, { startX, startY, width, height, translateX, translateY }) => {
        const deltaX = e.clientX - startX;
        const deltaY = startY - e.clientY;
        const x = range(translateX + deltaX, 0, horizontalBoundary - width);
        const y = range(translateY - deltaY, 0, verticalBoundary - height);

        preview.style.transform = `translate(${x}px, ${y}px)`;

        onDrag(width, height, x, y);
      }
    );
  }, [horizontalBoundary, previewRef, handleRef]);
};
