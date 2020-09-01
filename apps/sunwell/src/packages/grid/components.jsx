import React, { forwardRef } from "react"

export const Noop = () => null

export function Item({
  connect: [drag, nw, sw, ne, se],
  children,
  style,
  isPicked,
  isResizing,
  components,
}) {
  return isPicked ? (
    <Placeholder name="SortPlaceholder" style={style} components={components}>
      {children}
    </Placeholder>
  ) : isResizing ? (
    <Placeholder name="ResizePlaceholder" style={style} components={components}>
      {children}
    </Placeholder>
  ) : (
    <>
      <Box ref={drag} style={style} components={components}>
        <ResizeTrigger ref={nw} angle="nw" components={components} />
        <ResizeTrigger ref={sw} angle="sw" components={components} />
        <ResizeTrigger ref={ne} angle="ne" components={components} />
        <ResizeTrigger ref={se} angle="se" components={components} />
        {children}
      </Box>
    </>
  )
}

export const Box = forwardRef(function Box(
  { children, style, components },
  ref
) {
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

export function Placeholder({ children, style, name, components }) {
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

export function OuterItem({ style, components }) {
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

const ResizeTrigger = forwardRef(function ResizeTrigger(
  { angle, components },
  ref
) {
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
