import React, { forwardRef } from "react";

export default forwardRef(function Resize({ position }, ref) {
  const positions = {
    nw: ["top", "left"],
    sw: ["bottom", "left"],
    ne: ["top", "right"],
    se: ["bottom", "right"]
  };

  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        cursor: `${position}-resize`,
        zIndex: 3,
        width: 20,
        height: 20,
        ...positions[position].reduce((acc, key) => ({ ...acc, [key]: 0 }), {})
      }}
    />
  );
});
