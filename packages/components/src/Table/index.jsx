import React, { cloneElement, createContext, useContext } from "react"
import * as styles from "./index.styles"

// side view is not a table feature. it should be implemented somewhere else, but it's a feature of table module

// table should not have so much features, complex tables should be implemented by a components composition instead. for example compose to a table side view, collapse or pagination, filters and so on
// table should have checkboxes and sorting at max probably. also implement heading groups

const Context = createContext()

export default function Table({
  children,
  columns,
  size = "normal",
  bordered = false,
  ...props
}) {
  return (
    <Context.Provider value={{ columns }}>
      <div
        {...props}
        css={[styles.root, styles.sizes[size], bordered && styles.bordered]}
      >
        {children}
      </div>
    </Context.Provider>
  )
}

Table.Thead = function Thead({ children, ...props }) {
  return (
    <div {...props} css={styles.thead}>
      {children}
    </div>
  )
}

Table.Th = function Th({ children, align = "left", ...props }) {
  return (
    <div {...props} css={[styles.th, styles.align[align]]}>
      {children}
    </div>
  )
}

Table.Tbody = function Thead({ children, ...props }) {
  return (
    <div {...props} css={styles.tbody}>
      {children}
    </div>
  )
}

Table.Tr = function Tr({
  children,
  ...props
  // onClick,
  // isSelectable,
  // isSelected,
}) {
  const { columns } = useContext(Context)
  const count = React.Children.count(children)
  const widths = calcWidths(columns || new Array(count).fill("auto"))

  return (
    <div {...props} css={styles.tr}>
      {React.Children.map(children, (el, i) =>
        cloneElement(el, {
          style: { width: widths[i] },
        })
      )}
    </div>
  )
}

Table.Td = function Td({ children, align = "left", ...props }) {
  return (
    <div {...props} css={[styles.td, styles.align[align]]}>
      {children}
    </div>
  )
}

const calcWidths = columns => {
  const autoCount = columns.filter(el => el == "auto").length
  const customCols = columns.filter(el => el !== "auto").join(" + ") || "0px"

  const widths = columns.map(el =>
    el !== "auto" ? el : `calc((100% - calc(${customCols})) / ${autoCount})`
  )

  return widths
}
