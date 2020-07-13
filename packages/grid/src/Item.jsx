import React, { useRef } from "react";
import Placeholder from "./Placeholder";
import useDraggable from "./useDraggable";
import useResizable from "./useResizable";

export default function Item({
  style,
  minWidth,
  minHeight,
  horizontalBoundary,
  verticalBoundary,
  children,
  customization,
  onCustomizeStart,
  onCustomizeEnd,
  onCustomize
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

  return (
    <>
      <div
        ref={node => {
          draggable.handleRef.current = draggable.handleRef.current || node;
        }}
        style={{
          position: "absolute",
          userSelect: "none",
          zIndex: 2,
          ...style
        }}
      >
        {typeof children !== "function"
          ? children
          : children({
              customization,
              draggable,
              resizable
            })}
      </div>
      {customization && (
        <>
          <div
            ref={node => {
              resizable.previewRef.current =
                resizable.previewRef.current || node;
              draggable.previewRef.current =
                draggable.previewRef.current || node;
            }}
          />
          <Placeholder style={style} />
        </>
      )}
    </>
  );
}
