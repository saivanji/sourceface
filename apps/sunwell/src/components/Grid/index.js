import React, { forwardRef, useCallback } from "react"
import Grid from "packages/grid"
// import styles from "./index.scss"

export default function ({ isEditable, positions, onChange, renderItem }) {
  const onChangeWrap = useCallback(event => onChange(event.layout), [])

  console.log(positions)

  return (
    <Grid
      rows={50}
      cols={10}
      rowHeight={80}
      isStatic={!isEditable}
      layout={positions}
      onChange={onChangeWrap}
      renderItem={renderItem}
      components={{
        Box,
        OuterItem,
        DragPlaceholder: Placeholder,
        ResizePlaceholder: Placeholder,
      }}
    />
  )
}

const OuterItem = ({ style }) => {
  return (
    <div
      style={{
        ...style,
        backgroundColor: "skyblue",
        border: "2px dashed blue",
        transition: "all cubic-bezier(0.2, 0, 0, 1) .2s",
        borderRadius: 4,
      }}
    ></div>
  )
}

const Placeholder = ({ style }) => {
  return (
    <div
      style={{
        ...style,
        backgroundColor: "lightGray",
        transition: "all cubic-bezier(0.2, 0, 0, 1) .2s",
        borderRadius: 4,
      }}
    ></div>
  )
}

const Box = forwardRef(({ children, style }, ref) => (
  <div
    ref={ref}
    style={{
      ...style,
      transition: "all cubic-bezier(0.2, 0, 0, 1) .2s",
    }}
  >
    {children}
  </div>
))
