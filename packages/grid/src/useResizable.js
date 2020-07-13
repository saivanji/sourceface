import { useEffect, useContext } from "react";
import { getTransform, drag } from "./dom";
import { range } from "./utils";
import { itemContext } from "./context";

export default ({ previewRef, nwRef, swRef, neRef, seRef }) => {
  const {
    horizontalLimit,
    verticalLimit,
    minWidth,
    minHeight,
    onMotionStart,
    onMotionEnd,
    onMotion
  } = useContext(itemContext);

  useEffect(() => {
    const nw = nwRef.current;
    const sw = swRef.current;
    const ne = neRef.current;
    const se = seRef.current;

    const args = [
      previewRef,
      minWidth,
      minHeight,
      horizontalLimit,
      verticalLimit,
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
    horizontalLimit,
    verticalLimit,
    minWidth,
    minHeight,
    onMotionStart,
    onMotionEnd,
    onMotion
  ]);
};

const listen = (
  position,
  node,
  previewRef,
  minWidth,
  minHeight,
  horizontalLimit,
  verticalLimit,
  onResizeStart,
  onResizeEnd,
  onResize
) => {
  let payload;

  return drag(
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

      if (!payload) {
        const { translateX: initialX, translateY: initialY } = getTransform(
          preview
        );

        payload = {
          initialX,
          initialY,
          initialWidth: preview.offsetWidth,
          initialHeight: preview.offsetHeight
        };
      }

      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      const isNorth = position === "nw" || position === "ne";
      const isWest = position === "nw" || position === "sw";
      const { initialX, initialY, initialWidth, initialHeight } = payload;

      const [w, x] = change(
        isWest,
        deltaX,
        initialX,
        initialWidth,
        minWidth,
        horizontalLimit
      );
      const [h, y] = change(
        isNorth,
        deltaY,
        initialY,
        initialHeight,
        minHeight,
        verticalLimit
      );

      preview.style.width = `${w}px`;
      preview.style.height = `${h}px`;
      preview.style.transform = `translate(${x}px, ${y}px)`;

      onResize({ w, h, x, y });
    }
  );
};

const change = (cond, delta, initialOffset, initialSize, minSize, limit) => {
  if (cond) {
    return [
      range(initialSize - delta, minSize, initialSize + initialOffset),
      range(initialOffset + delta, 0, initialOffset + initialSize - minSize)
    ];
  }

  return [
    range(initialSize + delta, minSize, limit - initialOffset),
    initialOffset
  ];
};
