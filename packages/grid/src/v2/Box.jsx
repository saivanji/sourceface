import React, { forwardRef } from "react";

export default forwardRef(
  (
    {
      style,
      previewStyle,
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
        <DragPreview style={previewStyle}>{content}</DragPreview>
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

const Preview = ({ children, style, x, y }) => (
  <div
    style={{
      ...style,
      position: "absolute"
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
