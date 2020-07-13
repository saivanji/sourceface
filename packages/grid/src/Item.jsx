import React, {
  useRef,
  useEffect,
  useState,
  useMemo,
  useContext,
  cloneElement,
  forwardRef
} from "react";
import Placeholder from "./Placeholder";
import Preview from "./Preview";
import Angle from "./Angle";
import useDraggable from "./useDraggable";
import useResizable from "./useResizable";
import { itemContext } from "./context";

export default function Item({ children, initialLoad, customization }) {
  const dragPreviewRef = useRef();
  const resizePreviewRef = useRef();
  const {
    x,
    y,
    width,
    height,
    components: {
      DragPlaceholder = Placeholder,
      DragPreview = Preview,
      DragHandle,
      ResizePlaceholder = Placeholder,
      ResizePreview = Preview
    }
  } = useContext(itemContext);

  const style = initialLoad
    ? { width, height, left: x, top: y }
    : positionToStyle({ x, y, width, height });

  // TODO: move to Motion component and have [] as deps
  const initialPosition = useMemo(
    () => ({
      x,
      y,
      width,
      height
    }),
    [customization]
  );
  const initialStyle = positionToStyle(initialPosition);

  return !customization ? (
    <Awaiting
      style={style}
      dragPreviewRef={dragPreviewRef}
      resizePreviewRef={resizePreviewRef}
    >
      {children}
    </Awaiting>
  ) : customization === "drag" ? (
    <>
      <DragPlaceholder style={style} />
      <DragPreview style={initialStyle} ref={dragPreviewRef}>
        {DragHandle && <DragHandle isDragging />}
        {children}
      </DragPreview>
    </>
  ) : (
    customization === "resize" && (
      <>
        <ResizePlaceholder style={style} style={style} />
        <ResizePreview style={initialStyle} ref={resizePreviewRef}>
          {children}
        </ResizePreview>
      </>
    )
  );
}

// TODO: Awaiting and Motion in a separate files
const Awaiting = ({ children, style, dragPreviewRef, resizePreviewRef }) => {
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

const positionToStyle = position => ({
  width: position.width,
  height: position.height,
  transform: `translate(${position.x}px, ${position.y}px)`
});
