import { useContext, useEffect } from "react";
import { listenDrag, getTransform } from "./dom";
import { drag } from "./utils";
import { itemContext } from "./context";

export default ({ previewRef, handleRef }) => {
  const { info, onMotionStart, onMotionEnd, onMotion } = useContext(
    itemContext
  );

  useEffect(() => {
    const handle = handleRef.current;
    let bounds;

    return listenDrag(
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

        if (!bounds) {
          bounds = {
            width: preview.offsetWidth,
            height: preview.offsetHeight,
            ...getTransform(preview)
          };
        }

        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        const { left, top } = drag(deltaX, deltaY, bounds, info);

        preview.style.transform = `translate(${left}px, ${top}px)`;

        onMotion({ left, top });
      }
    );
  }, [handleRef, previewRef, info, onMotionStart, onMotionEnd, onMotion]);
};
