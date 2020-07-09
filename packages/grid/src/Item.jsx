import React, { useRef, useEffect } from "react";

export default function Item({
  children,
  style,
  onDrag,
  onDragStart,
  onDragEnd
}) {
  const ref = useRef();

  useEffect(() => {
    ref.current.onmousedown = e => {
      onDragStart(e);

      // TODO: use container node instead
      document.body.onmousemove = e => onDrag(e);

      ref.current.onmouseup = e => {
        ref.current.onmouseup = null;
        document.body.onmousemove = null;
        onDragEnd(e);
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
