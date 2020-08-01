import React, { forwardRef } from "react"

export const Noop = () => null

// TODO: when pointerEvents "none" is set, cursor is ignored
export const Item = ({
  children,
  style,
  dragRef,
  nwRef,
  swRef,
  neRef,
  seRef,
  isDraggedOver,
  dragPreviewStyle,
  resizePreviewStyle,
  components,
}) => {
  return isDraggedOver || dragPreviewStyle ? (
    <>
      {isDraggedOver && (
        <Placeholder
          style={style}
          components={components}
          name="DragPlaceholder"
        >
          {children}
        </Placeholder>
      )}
      {dragPreviewStyle && (
        <DragPreview style={dragPreviewStyle} components={components}>
          {children}
        </DragPreview>
      )}
    </>
  ) : resizePreviewStyle ? (
    <>
      <Placeholder
        style={style}
        components={components}
        name="ResizePlaceholder"
      >
        {children}
      </Placeholder>
      <ResizePreview style={resizePreviewStyle} components={components}>
        {children}
      </ResizePreview>
    </>
  ) : (
    <Box style={style} components={components}>
      <ResizeTrigger ref={nwRef} angle="nw" components={components} />
      <ResizeTrigger ref={swRef} angle="sw" components={components} />
      <ResizeTrigger ref={neRef} angle="ne" components={components} />
      <ResizeTrigger ref={seRef} angle="se" components={components} />
      <Full ref={dragRef}>{children}</Full>
    </Box>
  )
}

export const Content = ({ data, components: { Content = Noop } }) => {
  return <Content data={data} />
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

const Box = ({ children, style, components }) => {
  const Parent = components.Box || "div"

  return (
    <Parent
      style={{
        ...style,
        position: "absolute",
      }}
    >
      {children}
    </Parent>
  )
}

const DragPreview = ({ children, style, components }) => {
  const Parent = components.DragPreview || "div"

  return (
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
    </Parent>
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
  const Parent = components.ResizeTrigger || Angle

  return (
    <Parent
      ref={ref}
      angle={angle}
      style={{
        position: "absolute",
        zIndex: 1,
      }}
    />
  )
})

const Angle = forwardRef(({ angle, style }, ref) => {
  const angles = {
    nw: ["top", "left"],
    sw: ["bottom", "left"],
    ne: ["top", "right"],
    se: ["bottom", "right"],
  }

  return (
    <div
      ref={ref}
      style={{
        ...style,
        cursor: `${angle}-resize`,
        width: 20,
        height: 20,
        ...angles[angle].reduce((acc, key) => ({ ...acc, [key]: 0 }), {}),
      }}
    />
  )
})

const Full = forwardRef(({ children, style }, ref) => {
  return (
    <div style={{ ...style, width: "100%", height: "100%" }} ref={ref}>
      {children}
    </div>
  )
})
