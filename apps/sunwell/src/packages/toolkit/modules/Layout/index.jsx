import React, { forwardRef } from "react"
import { identity } from "ramda"
import { Module, useEditor, useModule } from "packages/factory"
import Grill from "packages/grid"
import { createLayout } from "./utils"
import { useChangeGrid } from "./callbacks"
import styles from "./index.scss"

// TODO: get some props from context provided from Editor? (explore git history for the additional context)
// since that component is used inside another modules and there is no another way to get this data
//
// Use context only in that file. Use provider in Modules and consume data in Frame?

export default function Layout({ renderItem = identity }) {
  const { id: parentId = null } = useModule()
  const { modules, isEditing } = useEditor()
  const changeGrid = useChangeGrid(parentId)

  const layout = createLayout(parentId, modules)

  return (
    <Grill
      rows={50}
      cols={10}
      rowHeight={60}
      layout={layout}
      isStatic={!isEditing}
      onChange={changeGrid}
      components={{
        Box,
        OuterItem,
        SortPlaceholder: Placeholder,
        ResizePlaceholder: Placeholder,
      }}
      renderItem={(module) =>
        renderItem(
          <div className={styles.module}>
            <Module module={module} />
          </div>,
          module.id
        )
      }
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
