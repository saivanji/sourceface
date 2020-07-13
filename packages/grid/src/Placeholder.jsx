import React from "react";

export default function Placeholder({ style }) {
  return (
    <div
      style={{
        ...style,
        backgroundColor: "lightGray",
        position: "absolute",
        transition: "all .1s ease-in",
        zIndex: 1
      }}
    />
  );
}
