import React, { useRef, useContext } from "react";
import useDraggable from "./useDraggable";
import useResizable from "./useResizable";
import Angle from "./Angle";
import { itemContext } from "./context";

export default ({ children, style, dragPreviewRef, resizePreviewRef }) => {
  const {
    components: { DragHandle, ResizeHandle = Angle }
  } = useContext(itemContext);

  const dragHandleRef = useRef();

  const nwRef = useRef();
  const swRef = useRef();
  const neRef = useRef();
  const seRef = useRef();

  useDraggable({
    previewRef: dragPreviewRef,
    handleRef: dragHandleRef
  });
  useResizable({
    previewRef: resizePreviewRef,
    nwRef,
    swRef,
    neRef,
    seRef
  });

  return (
    <div
      ref={!DragHandle ? dragHandleRef : undefined}
      style={{
        position: "absolute",
        userSelect: "none",
        transition: "all cubic-bezier(0.2, 0, 0, 1) .2s",
        zIndex: 2,
        ...style
      }}
    >
      {DragHandle && <DragHandle ref={dragHandleRef} isDragging={false} />}
      {ResizeHandle && (
        <>
          <ResizeHandle ref={nwRef} position="nw" />
          <ResizeHandle ref={swRef} position="sw" />
          <ResizeHandle ref={neRef} position="ne" />
          <ResizeHandle ref={seRef} position="se" />
        </>
      )}
      {children}
    </div>
  );
};
