import React, { useRef } from "react";
import { useApply } from "./hooks";
import { useDrag } from "../lib";
import * as utils from "./utils";

export default function Awaiting({
  dragPreviewRef,
  children,
  bounds,
  onChange,
  onChangeStart,
  onChangeEnd,
  components: { DragHandle }
}) {
  const dragTriggerRef = useRef();
  const style = useApply(utils.toBoxCSS, [bounds]);

  useDrag(dragTriggerRef, dragPreviewRef, TYPE, {
    onMove: onChange,
    onStart: onChangeStart,
    onEnd: onChangeEnd
  });

  return (
    <div
      ref={!DragHandle ? dragTriggerRef : undefined}
      style={{
        position: "absolute",
        userSelect: "none",
        transition: "all cubic-bezier(0.2, 0, 0, 1) .2s",
        ...style
      }}
    >
      {DragHandle && <DragHandle ref={dragTriggerRef} isDragging={false} />}
      {children}
    </div>
  );
}

const TYPE = "box";
