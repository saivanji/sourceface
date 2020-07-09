import React from "react";

export default function Item({ style, onDrag, onDragStart, onDragEnd }) {
  return (
    <div
      draggable
      onDragStart={event => {
        hidePreviewImage(event);
        return onDragStart && onDragStart(event);
      }}
      onDrag={onDrag}
      onDragEnd={onDragEnd}
      style={{
        // transition: "transform .15s ease-out",
        position: "absolute",
        zIndex: 1,
        backgroundColor: "darkCyan",
        ...style
      }}
    />
  );
}

const hidePreviewImage = event => {
  const img = new Image();
  img.src = "";
  event.dataTransfer.setDragImage(img, 0, 0);
};
