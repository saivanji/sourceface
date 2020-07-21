import React, { forwardRef } from "react";

export default forwardRef(
  (
    {
      style,
      previewX,
      previewY,
      children,
      isChanging,
      components: {
        DragHandle,
        DragPlaceholder = Placeholder,
        DragPreview = Preview
      }
    },
    ref
  ) => {
    const content = (
      <>
        {DragHandle && <DragHandle ref={ref} isDragging={isChanging} />}
        {children}
      </>
    );

    return isChanging ? (
      <>
        <DragPlaceholder style={style} />
        <DragPreview x={previewX} y={previewY}>
          {content}
        </DragPreview>
      </>
    ) : (
      <Static ref={!DragHandle ? ref : void 0} style={style}>
        {content}
      </Static>
    );
  }
);

const Static = forwardRef(({ children, style }, ref) => (
  <div
    ref={ref}
    style={{
      ...style,
      position: "absolute",
      userSelect: "none",
      transition: "all cubic-bezier(0.2, 0, 0, 1) .2s"
    }}
  >
    {children}
  </div>
));

const Preview = ({ children, x, y }) => (
  <div
    style={{
      position: "absolute",
      transform: `translate(${x}px, ${y}px)`,
      width: "119.714px",
      height: 240
    }}
  >
    {children}
  </div>
);

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
