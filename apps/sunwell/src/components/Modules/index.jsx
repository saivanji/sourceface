import React, { useRef, forwardRef } from "react"
import cx from "classnames"
import { Module, useEditor } from "packages/factory"
import Grill from "packages/grid"
import { useClickOutside } from "hooks/index"
import { populateLayout } from "./utils"
import { useChangeGrid } from "./callbacks"
import styles from "./index.scss"

export default function Modules() {
  const { layout, modules } = useEditor()

  return !layout ? (
    "Loading..."
  ) : (
    <Frame layout={populateLayout(layout, modules)} />
  )
}

// TODO: get some props from context provided from Editor? (explore git history for the additional context)
// since that component is used inside another modules and there is no another way to get this data
//
// Use context only in that file. Use provider in Modules and consume data in Frame?
function Frame({ layout }) {
  const { isEditing, selected } = useEditor()
  const changeGrid = useChangeGrid(layout)

  return (
    <Grill
      rows={50}
      cols={10}
      rowHeight={60}
      layout={layout.positions}
      isStatic={!isEditing}
      onChange={changeGrid}
      components={{
        Box,
        OuterItem,
        SortPlaceholder: Placeholder,
        ResizePlaceholder: Placeholder,
      }}
      renderItem={(module) => {
        const isSelected = isEditing && selected?.id === module.id
        const element = <Module module={module} frame={Frame} />

        return !isEditing ? (
          <div className={styles.module}>{element}</div>
        ) : (
          <Edition id={module.id} isSelected={isSelected}>
            {element}
          </Edition>
        )
      }}
    />
  )
}

const Edition = ({ children, id, isSelected }) => {
  const { select } = useEditor()
  const ref = useRef()

  useClickOutside(ref, () => isSelected && select(null))

  return (
    <div
      ref={ref}
      onClick={(e) => {
        /**
         * Propagating click events in order to be able to click on nested module
         */
        e.stopPropagation()
        select(id)
      }}
      className={cx(
        styles.module,
        styles.editing,
        isSelected && styles.selected
      )}
    >
      {children}
    </div>
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
