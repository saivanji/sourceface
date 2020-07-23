import React, { forwardRef } from "react"

export default ({
  dragRef,
  nwRef,
  swRef,
  neRef,
  seRef,
  style,
  dragPreviewStyle,
  resizePreviewStyle,
  children,
  isDragging,
  isResizing,
  components: {
    DragHandle,
    DragPlaceholder = Placeholder,
    DragPreview = Preview,
    ResizeHandle = Angle,
    ResizePlaceholder = Placeholder,
    ResizePreview = Preview,
  },
}) => {
  const content = (
    <>
      {DragHandle && <DragHandle ref={dragRef} isDragging={isDragging} />}
      {ResizeHandle && (
        <>
          <ResizeHandle ref={nwRef} isResizing={isResizing} position="nw" />
          <ResizeHandle ref={swRef} isResizing={isResizing} position="sw" />
          <ResizeHandle ref={neRef} isResizing={isResizing} position="ne" />
          <ResizeHandle ref={seRef} isResizing={isResizing} position="se" />
        </>
      )}
      {children}
    </>
  )

  return isDragging ? (
    <>
      <DragPlaceholder style={style} />
      <DragPreview style={dragPreviewStyle}>{content}</DragPreview>
    </>
  ) : isResizing ? (
    <>
      <ResizePlaceholder style={style} />
      <ResizePreview style={resizePreviewStyle}>{content}</ResizePreview>
    </>
  ) : (
    <Static ref={!DragHandle ? dragRef : void 0} style={style}>
      {content}
    </Static>
  )
}

const Static = forwardRef(({ children, style }, ref) => (
  <div
    ref={ref}
    style={{
      ...style,
      position: "absolute",
      transition: "all cubic-bezier(0.2, 0, 0, 1) .2s",
    }}
  >
    {children}
  </div>
))

const Preview = ({ children, style }) => (
  <div
    style={{
      ...style,
      position: "absolute",
    }}
  >
    {children}
  </div>
)

const Placeholder = ({ style }) => {
  return (
    <div
      style={{
        ...style,
        backgroundColor: "lightGray",
        position: "absolute",
        transition: "all cubic-bezier(0.2, 0, 0, 1) .2s",
      }}
    />
  )
}

const Angle = forwardRef(({ position }, ref) => {
  const positions = {
    nw: ["top", "left"],
    sw: ["bottom", "left"],
    ne: ["top", "right"],
    se: ["bottom", "right"],
  }

  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        cursor: `${position}-resize`,
        zIndex: 3,
        width: 20,
        height: 20,
        ...positions[position].reduce((acc, key) => ({ ...acc, [key]: 0 }), {}),
      }}
    />
  )
})
