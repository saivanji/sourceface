import React from "react";

export default function Placeholder({ style }) {
  return (
    <div
      style={{
        ...style,
        backgroundColor: "lightGray",
        position: "absolute",
        transition: "all cubic-bezier(0.2, 0, 0, 1) .2s",
        zIndex: 1
      }}
    />
  );
}
