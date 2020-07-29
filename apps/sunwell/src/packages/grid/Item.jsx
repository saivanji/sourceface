import React from "react"

export default ({
  children,
  style,
  dragRef,
  dragPreview,
  components: { DragPreview = Noop },
}) => {
  return dragPreview ? (
    <div
      style={{
        position: "absolute",
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
