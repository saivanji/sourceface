import React, { useRef } from "react";
import useDraggable from "./useDraggable";
import useResizable from "./useResizable";

export default function Item({
  style,
  minWidth,
  minHeight,
  horizontalBoundary,
  verticalBoundary,
  children,
  onCustomizeStart,
  onCustomizeEnd,
  onCustomize
}) {
  const elementRef = useRef();
  const draggable = {
    handleRef: useRef(),
    previewRef: useRef()
  };
  const resizable = {
    nwRef: useRef(),
    swRef: useRef(),
    neRef: useRef(),
    seRef: useRef()
  };

  const isCustom = typeof children === "function";
  const draggableRefs = isCustom
    ? draggable
    : {
        handleRef: elementRef,
        previewRef: elementRef
      };

  useDraggable({
    ...draggableRefs,
    horizontalBoundary,
    verticalBoundary,
    onDragStart: e => onCustomizeStart("drag", e),
    onDragEnd: onCustomizeEnd,
    onDrag: onCustomize
  });
  useResizable({
    ...resizable,
    elementRef,
    horizontalBoundary,
    verticalBoundary,
    minWidth,
    minHeight,
    onResizeStart: e => onCustomizeStart("resize", e),
    onResizeEnd: onCustomizeEnd,
    onResize: onCustomize
  });

  // probably render placeholder here
  return (
    <div
      ref={elementRef}
      style={{
        position: "absolute",
        userSelect: "none",
        zIndex: 2,
        ...style
      }}
    >
      {!isCustom
        ? children
        : children({
            customization: "type",
            draggable,
            resizable
          })}
    </div>
  );
}
