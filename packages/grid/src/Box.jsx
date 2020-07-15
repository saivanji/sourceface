import React, { useRef, useContext } from "react";
import Awaiting from "./Awaiting";
import Motion from "./Motion";
import { itemContext } from "./context";
import { boundsToStyle } from "./dom";

export default function Box({ children, motion }) {
  const dragPreviewRef = useRef();
  const resizePreviewRef = useRef();
  const { bounds, info } = useContext(itemContext);

  const style = !info.containerWidth ? bounds : boundsToStyle(bounds);

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
