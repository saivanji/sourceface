import React, { forwardRef, useMemo } from "react";
import { useApply } from "./hooks";
import * as utils from "./utils";

export default function Active({
  dragPreviewRef,
  children,
  bounds,
  components: {
    DragPlaceholder = Placeholder,
    DragPreview = Preview,
    DragHandle
  }
}) {
  const style = useApply(utils.toBoxCSS, [bounds]);
  const initialStyle = useMemo(() => utils.toBoxCSS(bounds), []);

  return (
    <>
      <DragPlaceholder style={style} />
      <DragPreview ref={dragPreviewRef} style={initialStyle}>
        {DragHandle && <DragHandle isDragging />}
        {children}
      </DragPreview>
    </>
  );
}

const Preview = forwardRef(({ style, children }, ref) => (
  <div ref={ref} style={{ ...style, position: "absolute" }}>
    {children}
  </div>
));

const Placeholder = ({ style }) => {
  return (
    <div
      style={{
        ...style,
        backgroundColor: "lightGray",
        position: "absolute",
        transition: "all cubic-bezier(0.2, 0, 0, 1) .2s"
      }}
    />
  );
};
