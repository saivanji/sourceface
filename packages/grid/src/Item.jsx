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
      onDragStart();

      // TODO: use container node instead
      document.body.onmousemove = e => {
        console.log(shiftX, shiftY);
        const x = e.pageX - shiftX;
        const y = e.pageY - shiftY;

        // // not allowing drag outside of a grid
        // if (cursorX < 0 || cursorY < 0) return;

        e.target.style.transform = `translate(${x}px, ${y}px)`;
      };

      ref.current.onmouseup = e => {
        ref.current.onmouseup = null;
        document.body.onmousemove = null;

        e.target.style.transform = style.transform;

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
