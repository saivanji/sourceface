import { useContext, useEffect } from "react";
import { range } from "./utils";
import { drag, getTransform } from "./dom";
import { itemContext } from "./context";

export default ({ previewRef, handleRef }) => {
  const {
    horizontalLimit,
    verticalLimit,
    onMotionStart,
    onMotionEnd,
    onMotion
  } = useContext(itemContext);

  useEffect(() => {
    const handle = handleRef.current;
    let payload;

    return drag(
      handle,
      e => {
        handle.style.cursor = "grabbing";
        onMotionStart("drag", e);

        return {
          startX: e.clientX,
          startY: e.clientY
        };
      },
      () => {
        handle.style.cursor = "";
        onMotionEnd();
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
        const x = range(translateX + deltaX, 0, horizontalLimit - width);
        const y = range(translateY + deltaY, 0, verticalLimit - height);

        preview.style.transform = `translate(${x}px, ${y}px)`;

        onMotion({ x, y });
      }
    );
  }, [
    handleRef,
    previewRef,
    horizontalLimit,
    verticalLimit,
    onMotionStart,
    onMotionEnd,
    onMotion
  ]);
};
