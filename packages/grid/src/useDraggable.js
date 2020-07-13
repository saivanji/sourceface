import { useContext, useEffect } from "react";
import { range } from "./utils";
import { drag, getTransform } from "./dom";
import { itemContext } from "./context";

export default ({ previewRef, handleRef }) => {
  const {
    horizontalBoundary,
    verticalBoundary,
    onCustomizeStart,
    onCustomizeEnd,
    onCustomize
  } = useContext(itemContext);

  useEffect(() => {
    const handle = handleRef.current;
    let payload;

    return drag(
      handle,
      e => {
        handle.style.cursor = "grabbing";
        onCustomizeStart("drag", e);

        return {
          startX: e.clientX,
          startY: e.clientY
        };
      },
      () => {
        handle.style.cursor = "";
        onCustomizeEnd();
      },
      (e, { startX, startY }) => {
        const preview = previewRef.current;
        if (!preview) return;

        if (!payload) {
          payload = {
            width: preview.offsetWidth,
            height: preview.offsetHeight,
            ...getTransform(preview)
          };
        }

        const { translateX, translateY, width, height } = payload;
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        const x = range(translateX + deltaX, 0, horizontalBoundary - width);
        const y = range(translateY + deltaY, 0, verticalBoundary - height);

        preview.style.transform = `translate(${x}px, ${y}px)`;

        onCustomize({ x, y });
      }
    );
  }, [horizontalBoundary, handleRef, previewRef]);
};
