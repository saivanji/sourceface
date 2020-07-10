import React, { useRef } from "react";
import useDraggable from "./useDraggable";

export default function Item({
  style,
  container,
  children,
  onDragStart,
  onDragEnd
}) {
  const elementRef = useRef();
  const handleRef = useRef();
  const isCustom = typeof children === "function";

  useDraggable({
    elementRef,
    handleRef: !isCustom ? elementRef : handleRef,
    style,
    container,
    onDragStart,
    onDragEnd
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
      {!isCustom ? children : children({ handleRef })}
    </div>
  );
}
