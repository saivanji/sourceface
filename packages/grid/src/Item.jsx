import React, { useRef } from "react";
import useDraggable from "./useDraggable";

export default function Item({
  style,
  container,
  children,
  onDragStart,
  onDragEnd
}) {
  const draggable = useRef();

  useDraggable({ ref: draggable, style, container, onDragStart, onDragEnd });

  return (
    <div
      ref={draggable}
      style={{
        position: "absolute",
        userSelect: "none",
        zIndex: 2,
        ...style
      }}
    >
      {children}
    </div>
  );
}
