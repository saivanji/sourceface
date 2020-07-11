import React, { useRef } from "react";
import useDraggable from "./useDraggable";
import useResizable from "./useResizable";

export default function Item({
  style,
  containerRef,
  calcMinWidth,
  minHeight,
  children,
  onCustomizeStart,
  onCustomizeEnd
}) {
  const elementRef = useRef();
  const handleRef = useRef();
  const nwRef = useRef();
  const swRef = useRef();
  const neRef = useRef();
  const seRef = useRef();

  const isCustom = typeof children === "function";

  useDraggable({
    containerRef,
    elementRef,
    handleRef: !isCustom ? elementRef : handleRef,
    style,
    onDragStart: onCustomizeStart,
    onDragEnd: onCustomizeEnd
  });
  useResizable({
    containerRef,
    elementRef,
    nwRef,
    swRef,
    neRef,
    seRef,
    calcMinWidth,
    minHeight,
    onResizeStart: onCustomizeStart,
    onResizeEnd: onCustomizeEnd
  });

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
            handleRef,
            resizable: {
              nwRef,
              swRef,
              neRef,
              seRef
            }
          })}
    </div>
  );
}
