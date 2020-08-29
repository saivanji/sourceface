import React, { forwardRef } from "react"
import { createPortal } from "react-dom"

export const Noop = () => null

export const Item = ({
  children,
  style,
  dragRef,
  nwRef,
  swRef,
  neRef,
  seRef,
  components,
}) => {
  return (
    <Box ref={dragRef} style={style} components={components}>
      <ResizeTrigger ref={nwRef} angle="nw" components={components} />
      <ResizeTrigger ref={swRef} angle="sw" components={components} />
      <ResizeTrigger ref={neRef} angle="ne" components={components} />
      <ResizeTrigger ref={seRef} angle="se" components={components} />
      {children}
    </Box>
  )
}

export const OuterItem = ({ style, components }) => {
  const Parent = components.OuterItem || Noop

  return (
    <Parent
      style={{
        ...style,
        position: "absolute",
        top: 0,
        left: 0,
      }}
    />
  )
}

export const Box = forwardRef(({ children, style, components }, ref) => {
  const Parent = components.Box || "div"

  return (
    <Parent
      ref={ref}
      style={{
        ...style,
        position: "absolute",
      }}
    >
      {children}
    </Parent>
  )
})

const DragPreview = ({ children, style, components }) => {
  const Parent = components.DragPreview || "div"

  return createPortal(
    <Parent
      style={{
        ...style,
        position: "fixed",
        top: 0,
        left: 0,
        pointerEvents: "none",
        zIndex: 1,
      }}
    >
      {children}
    </Parent>,
    // TODO: cache
    document.getElementById("preview-container")
  )
}

const Placeholder = ({ children, style, name, components }) => {
  const Parent = components[name] || Noop

  return (
    <Parent
      style={{
        ...style,
        position: "absolute",
        top: 0,
        left: 0,
      }}
    >
      {children}
    </Parent>
  )
}

const ResizePreview = ({ children, style, components }) => {
  const Parent = components.ResizePreview || "div"

  return (
    <Parent
      style={{
        ...style,
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 1,
      }}
    >
      {children}
    </Parent>
  )
}

const ResizeTrigger = forwardRef(({ angle, components }, ref) => {
  const angles = {
    nw: ["top", "left"],
    sw: ["bottom", "left"],
    ne: ["top", "right"],
    se: ["bottom", "right"],
  }
  const style = {
    position: "absolute",
    zIndex: 1,
    ...angles[angle].reduce((acc, key) => ({ ...acc, [key]: 0 }), {}),
  }

  if (components.ResizeTrigger) {
    return <components.ResizeTrigger ref={ref} style={style} />
  }

  return (
    <div
      ref={ref}
      style={{
        ...style,
        cursor: `${angle}-resize`,
        width: 20,
        height: 20,
      }}
    />
  )
})
