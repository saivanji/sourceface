import React, { forwardRef } from "react";

export default forwardRef(({ children, style }, ref) => {
  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        zIndex: 3,
        ...style
      }}
    >
      {children}
    </div>
  );
});
