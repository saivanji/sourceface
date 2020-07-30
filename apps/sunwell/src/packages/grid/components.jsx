import React from "react"

// TODO: when pointerEvents "none" is set, cursor is ignored
export const Item = ({
  children,
  style,
  dragRef,
  dragPreview,
  components: { DragPreview = Noop },
}) => {
  return dragPreview ? (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        pointerEvents: "none",
        zIndex: 1,
        transform: `translate(${dragPreview.x}px, ${dragPreview.y}px)`,
      }}
    >
      <DragPreview />
    </div>
  ) : (
    <div
      ref={dragRef}
      style={{
        ...style,
        position: "absolute",
      }}
    >
      {children}
    </div>
  )
}

const Noop = () => null
