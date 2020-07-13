import React, {
  useRef,
  useEffect,
  useState,
  useMemo,
  cloneElement,
  forwardRef
} from "react";
import Placeholder from "./Placeholder";
import Preview from "./Preview";
import DefaultResizeHandle from "./ResizeHandle";
import useDraggable from "./useDraggable";
import useResizable from "./useResizable";

export default function Item({
  initialLoad,
  x,
  y,
  width,
  height,
  minWidth,
  minHeight,
  horizontalBoundary,
  verticalBoundary,
  children,
  customization,
  onCustomizeStart,
  onCustomizeEnd,
  onCustomize,
  components: {
    DragHandle,
    DragPreview = Preview,
    DragPlaceholder = Placeholder,
    ResizeHandle = DefaultResizeHandle,
    ResizePreview = Preview,
    ResizePlaceholder = Placeholder
  } = {}
}) {
  const dragPreviewRef = useRef();
  const resizePreviewRef = useRef();

  const style = initialLoad
    ? { width, height, left: x, top: y }
    : positionToStyle({ x, y, width, height });

  // TODO: move to Customizing component and have [] as deps
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
    <Static
      style={style}
      minWidth={minWidth}
      minHeight={minHeight}
      horizontalBoundary={horizontalBoundary}
      verticalBoundary={verticalBoundary}
      dragPreviewRef={dragPreviewRef}
      resizePreviewRef={resizePreviewRef}
      onCustomizeStart={onCustomizeStart}
      onCustomizeEnd={onCustomizeEnd}
      onCustomize={onCustomize}
      DragHandle={DragHandle}
      ResizeHandle={ResizeHandle}
    >
      {children}
    </Static>
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

// TODO: Static and Customizing in a separate files?

// TODO: use context so it can be used even in hooks?
const Static = ({
  children,
  style,
  minWidth,
  minHeight,
  horizontalBoundary,
  verticalBoundary,
  dragPreviewRef,
  resizePreviewRef,
  onCustomizeStart,
  onCustomizeEnd,
  onCustomize,
  DragHandle,
  ResizeHandle
}) => {
  const dragHandleRef = useRef();

  const nwRef = useRef();
  const swRef = useRef();
  const neRef = useRef();
  const seRef = useRef();

  useDraggable({
    previewRef: dragPreviewRef,
    handleRef: dragHandleRef,
    horizontalBoundary,
    verticalBoundary,
    onDragStart: e => onCustomizeStart("drag", e),
    onDragEnd: onCustomizeEnd,
    onDrag: onCustomize
  });
  useResizable({
    previewRef: resizePreviewRef,
    nwRef,
    swRef,
    neRef,
    seRef,
    horizontalBoundary,
    verticalBoundary,
    minWidth,
    minHeight,
    onResizeStart: e => onCustomizeStart("resize", e),
    onResizeEnd: onCustomizeEnd,
    onResize: onCustomize
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
