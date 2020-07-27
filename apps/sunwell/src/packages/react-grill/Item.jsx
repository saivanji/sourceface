import React, { forwardRef } from "react"

export default ({
  dragRef,
  nwRef,
  swRef,
  neRef,
  seRef,
  children,
  style,
  previewStyle,
  isDraggable,
  isResizable,
  isDragging,
  isResizing,
  components: {
    Item = Floating,
    DragTrigger = Layer,
    DragPlaceholder = Brick,
    DragPreview = Free,
    ResizeTrigger = Angle,
    ResizePlaceholder = Brick,
    ResizePreview = Free,
  },
}) => {
  const content = (
    <>
      {isDraggable ? (
        <DragTrigger ref={dragRef} isDragging={isDragging}>
          {children}
        </DragTrigger>
      ) : (
        children
      )}
      {isResizable && (
        <>
          <ResizeTrigger ref={nwRef} isResizing={isResizing} position="nw" />
          <ResizeTrigger ref={swRef} isResizing={isResizing} position="sw" />
          <ResizeTrigger ref={neRef} isResizing={isResizing} position="ne" />
          <ResizeTrigger ref={seRef} isResizing={isResizing} position="se" />
        </>
      )}
    </>
  )

  return isDragging ? (
    <>
      <DragPlaceholder style={style} />
      <DragPreview style={previewStyle}>{content}</DragPreview>
    </>
  ) : isResizing ? (
    <>
      <ResizePlaceholder style={style} />
      <ResizePreview style={previewStyle}>{content}</ResizePreview>
    </>
  ) : (
    <Item style={style}>{content}</Item>
  )
}

const Free = ({ children, style }) => (
  <div
    style={{
      ...style,
      position: "absolute",
      zIndex: 2,
    }}
  >
    {children}
  </div>
)

const Floating = ({ children, style }) => (
  <div
    style={{
      ...style,
      position: "absolute",
      transition: "all cubic-bezier(0.2, 0, 0, 1) .2s",
    }}
  >
    {children}
  </div>
)

const Brick = ({ style }) => {
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

const Layer = forwardRef(({ children }, ref) => (
  <div
    ref={ref}
    style={{
      position: "absolute",
      left: 0,
      top: 0,
      width: "100%",
      height: "100%",
    }}
  >
    {children}
  </div>
))

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
        zIndex: 1,
        width: 20,
        height: 20,
        ...positions[position].reduce((acc, key) => ({ ...acc, [key]: 0 }), {}),
      }}
    />
  )
})
