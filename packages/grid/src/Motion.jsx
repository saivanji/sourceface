import React, { useContext, useMemo } from "react";
import Placeholder from "./Placeholder";
import Preview from "./Preview";
import { itemContext } from "./context";
import { boundsToStyle } from "./dom";

export default ({
  children,
  style,
  dragPreviewRef,
  resizePreviewRef,
  type
}) => {
  const {
    bounds,
    components: {
      DragPlaceholder = Placeholder,
      DragPreview = Preview,
      DragHandle,
      ResizePlaceholder = Placeholder,
      ResizePreview = Preview
    }
  } = useContext(itemContext);

  const initialBounds = useMemo(() => bounds, []);
  const initialStyle = boundsToStyle(initialBounds);

  return type === "drag" ? (
    <>
      <DragPlaceholder style={style} />
      <DragPreview style={initialStyle} ref={dragPreviewRef}>
        {DragHandle && <DragHandle isDragging />}
        {children}
      </DragPreview>
    </>
  ) : (
    type === "resize" && (
      <>
        <ResizePlaceholder style={style} />
        <ResizePreview style={initialStyle} ref={resizePreviewRef}>
          {children}
        </ResizePreview>
      </>
    )
  );
};
