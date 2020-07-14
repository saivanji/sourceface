import { useEffect, useContext } from "react";
import { getTransform, listenDrag } from "./dom";
import { itemContext } from "./context";
import * as utils from "./utils";

export default ({ previewRef, nwRef, swRef, neRef, seRef }) => {
  const { info, onMotionStart, onMotionEnd, onMotion } = useContext(
    itemContext
  );

  useEffect(() => {
    const nw = nwRef.current;
    const sw = swRef.current;
    const ne = neRef.current;
    const se = seRef.current;

    const args = [
      previewRef,
      info,
      e => onMotionStart("resize", e),
      onMotionEnd,
      onMotion
    ];

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
  }, [
    previewRef,
    nwRef,
    swRef,
    neRef,
    seRef,
    info,
    onMotionStart,
    onMotionEnd,
    onMotion
  ]);
};

const listen = (
  position,
  node,
  previewRef,
  info,
  onResizeStart,
  onResizeEnd,
  onResize
) => {
  let bounds;

  return listenDrag(
    node,
    e => {
      onResizeStart();

      return {
        startX: e.clientX,
        startY: e.clientY
      };
    },
    onResizeEnd,
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
      const isNorth = position === "nw" || position === "ne";
      const isWest = position === "nw" || position === "sw";
      const { minWidth, minHeight, containerWidth, containerHeight } = info;

      const [width, left] = utils.resize(
        isWest,
        deltaX,
        bounds.left,
        bounds.width,
        minWidth,
        containerWidth
      );
      const [height, top] = utils.resize(
        isNorth,
        deltaY,
        bounds.top,
        bounds.height,
        minHeight,
        containerHeight
      );

      preview.style.width = `${width}px`;
      preview.style.height = `${height}px`;
      preview.style.transform = `translate(${left}px, ${top}px)`;

      onResize({ width, height, left, top });
    }
  );
};
