import React, { forwardRef } from "react"

export const Noop = () => null

// TODO: when pointerEvents "none" is set, cursor is ignored
export const Item = ({
  children,
  style,
  dragRef,
  dragPreviewStyle,
  isDragging,
  components,
}) => {
  return isDragging || dragPreviewStyle ? (
    <>
      {isDragging && (
        <DragPlaceholder style={style} components={components}>
          {children}
        </DragPlaceholder>
      )}
      {dragPreviewStyle && (
        <DragPreview style={dragPreviewStyle} components={components}>
          {children}
        </DragPreview>
      )}
    </>
  ) : (
    <Box ref={dragRef} style={style} components={components}>
      {children}
    </Box>
  )
}

export const Content = ({ data, components: { Content = Noop } }) => {
  return <Content data={data} />
}

export const OuterItem = ({
  style,
  components: { OuterPlaceholder = Noop },
}) => {
  return (
    <OuterPlaceholder
      style={{
        ...style,
        position: "absolute",
        top: 0,
        left: 0,
      }}
    />
  )
}

const Box = forwardRef(({ children, style, components }, ref) => {
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

const DragPlaceholder = ({ children, style, components }) => {
  const Parent = components.DragPlaceholder || Noop

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
