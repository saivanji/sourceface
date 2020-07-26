import React, { forwardRef } from "react"

export function Awaiting({ style, ...props }) {
  const {
    components: { Item = Floating },
  } = props

  return (
    <Item style={style}>
      <Triggers {...props} />
    </Item>
  )
}

export function Motion({ style, previewStyle, ...props }) {
  const {
    isDragging,
    isResizing,
    components: {
      DragPlaceholder = Brick,
      DragPreview = Free,
      ResizePlaceholder = Brick,
      ResizePreview = Free,
    },
  } = props

  const content = <Triggers {...props} />

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
  ) : null
}

function Triggers({
  dragRef,
  nwRef,
  swRef,
  neRef,
  seRef,
  isDraggable,
  isResizable,
  isDragging,
  isResizing,
  children,
  components: { DragTrigger = Layer, ResizeTrigger = Angle },
}) {
  return (
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
}

const Free = ({ children, style }) => (
  <div
    style={{
      ...style,
      position: "absolute",
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
        zIndex: 3,
        width: 20,
        height: 20,
        ...positions[position].reduce((acc, key) => ({ ...acc, [key]: 0 }), {}),
      }}
    />
  )
})
