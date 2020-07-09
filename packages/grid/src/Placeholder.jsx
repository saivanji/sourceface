import React from "react";

export default function Placeholder({ style }) {
  return (
    <div
      style={{
        ...style,
        backgroundColor: "lightGray",
        position: "absolute",
        zIndex: 1
      }}
    />
  );
}
