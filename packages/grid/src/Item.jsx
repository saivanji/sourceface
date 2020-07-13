import React, {
  useRef,
  useEffect,
  useState,
  cloneElement,
  forwardRef
} from "react";
import Placeholder from "./Placeholder";
import Preview from "./Preview";
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
    ResizeHandle,
    ResizePreview = Preview,
    ResizePlaceholder = Placeholder
  } = {}
}) {
  const draggable = {
    handleRef: useRef(),
    previewRef: useRef()
  };
  const resizable = {
    previewRef: useRef(),
    nwRef: useRef(),
    swRef: useRef(),
    neRef: useRef(),
    seRef: useRef()
  };
  const position = {
    x,
    y,
    width,
    height
  };

  useDraggable({
    ...draggable,
    horizontalBoundary,
    verticalBoundary,
    onDragStart: e => onCustomizeStart("drag", e),
    onDragEnd: onCustomizeEnd,
    onDrag: onCustomize
  });
  useResizable({
    ...resizable,
    horizontalBoundary,
    verticalBoundary,
    minWidth,
    minHeight,
    onResizeStart: e => onCustomizeStart("resize", e),
    onResizeEnd: onCustomizeEnd,
    onResize: onCustomize
  });

  const style = initialLoad
    ? { width, height, left: x, top: y }
    : positionToStyle(position);

  return !customization ? (
    <div
      ref={!DragHandle ? draggable.handleRef : undefined}
      style={{
        position: "absolute",
        userSelect: "none",
        zIndex: 2,
        ...style
      }}
    >
      {DragHandle && (
        <DragHandle ref={draggable.handleRef} isDragging={false} />
      )}
      {ResizeHandle && (
        <>
          <ResizeHandle ref={resizable.nwRef} position="nw" />
          <ResizeHandle ref={resizable.swRef} position="sw" />
          <ResizeHandle ref={resizable.neRef} position="ne" />
          <ResizeHandle ref={resizable.seRef} position="se" />
        </>
      )}
      {children}
    </div>
  ) : customization === "drag" ? (
    <>
      <DragPlaceholder style={style} />
      <PreviewProvider position={position}>
        <DragPreview ref={draggable.previewRef}>
          {DragHandle && <DragHandle isDragging />}
          {children}
        </DragPreview>
      </PreviewProvider>
    </>
  ) : (
    customization === "resize" && (
      <>
        <ResizePlaceholder style={style} />
        <PreviewProvider position={position}>
          <ResizePreview ref={resizable.previewRef}>{children}</ResizePreview>
        </PreviewProvider>
      </>
    )
  );
}

const PreviewProvider = ({ position, children }) => {
  const data = useRef(null);
  const initialPosition = data.current || position;
  const style = positionToStyle(initialPosition);

  useEffect(() => {
    data.current = position;
  }, []);

  return cloneElement(children, { style, position: initialPosition });
};

const positionToStyle = position => ({
  width: position.width,
  height: position.height,
  transform: `translate(${position.x}px, ${position.y}px)`
});
