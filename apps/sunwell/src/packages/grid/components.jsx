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
    <DragPreview
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        pointerEvents: "none",
        zIndex: 1,
        transform: `translate(${dragPreview.x}px, ${dragPreview.y}px)`,
      }}
    />
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
