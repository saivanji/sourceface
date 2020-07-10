import React, { useRef } from "react";
import useDraggable from "./useDraggable";

export default function Item({
  style,
  container,
  children,
  onDragStart,
  onDragEnd
}) {
  const element = useRef();
  const handle = useRef();

  useDraggable({
    element,
    handle: typeof element !== "function" ? element : handle,
    style,
    container,
    onDragStart,
    onDragEnd
  });

  return (
    <div
      ref={element}
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
