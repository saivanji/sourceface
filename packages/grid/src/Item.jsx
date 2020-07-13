import React, { useRef, useContext } from "react";
import Awaiting from "./Awaiting";
import Motion from "./Motion";
import { itemContext } from "./context";
import { boundsToStyle } from "./dom";

export default function Item({ children, initialLoad, motion }) {
  const dragPreviewRef = useRef();
  const resizePreviewRef = useRef();
  const { x, y, width, height } = useContext(itemContext);

  const style = initialLoad
    ? { width, height, left: x, top: y }
    : boundsToStyle({ x, y, width, height });

  return !motion ? (
    <Awaiting
      style={style}
      dragPreviewRef={dragPreviewRef}
      resizePreviewRef={resizePreviewRef}
    >
      {children}
    </Awaiting>
  ) : (
    <Motion
      style={style}
      type={motion}
      dragPreviewRef={dragPreviewRef}
      resizePreviewRef={resizePreviewRef}
    >
      {children}
    </Motion>
  );
}
