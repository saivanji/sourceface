import React, { useRef, useEffect } from "react";

export default function Item({
  style,
  children,
  isDragging,
  onDragStart,
  onDragEnd
}) {
  const ref = useRef();

  useEffect(() => {
    ref.current.onmousedown = e => {
      const { left, top } = e.target.getBoundingClientRect();
      const shiftX = e.clientX - left;
      const shiftY = e.clientY - top;

      const move = e => {
        // // not allowing drag outside of a grid
        // if (cursorX < 0 || cursorY < 0) return;

        const x = e.pageX - shiftX;
        const y = e.pageY - shiftY;
        ref.current.style.transform = `translate(${x}px, ${y}px)`;
      };

      onDragStart();
      document.addEventListener("mousemove", move);

      ref.current.onmouseup = e => {
        ref.current.onmouseup = null;
        document.removeEventListener("mousemove", move);

        ref.current.style.transform = style.transform;

        onDragEnd();
      };
    };

    return () => {
      ref.current.onmousedown = null;
    };
  }, []);

  return (
    <div
      ref={ref}
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
