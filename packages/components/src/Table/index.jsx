import React, { cloneElement, createContext, useContext } from "react"
import cx from "classnames"
import styles from "./index.scss"

// side view is not a table feature. it should be implemented somewhere else, but it's a feature of table module

// table should not have so much features, complex tables should be implemented by a components composition instead. for example compose to a table side view, collapse or pagination, filters and so on
// table should have checkboxes and sorting at max probably. also implement heading groups

const Context = createContext()

export default function Table({
  children,
  className,
  columns,
  size = "normal",
  bordered = false,
  ...props
}) {
  return (
    <Context.Provider value={{ columns }}>
      <div
        {...props}
        className={cx(
          styles.root,
          styles[size],
          bordered && styles.bordered,
          className
        )}
      >
        {children}
      </div>
    </Context.Provider>
  )
}

Table.Thead = function Thead({ children, className, ...props }) {
  return (
    <div {...props} className={cx(styles.thead, className)}>
      {children}
    </div>
  )
}

Table.Th = function Th({ children, className, align = "left", ...props }) {
  return (
    <div
      {...props}
      className={cx(styles.th, styles[alignClassNames[align]], className)}
    >
      {children}
    </div>
  )
}

Table.Tbody = function Thead({ children, className, ...props }) {
  return (
    <div {...props} className={cx(styles.tbody, className)}>
      {children}
    </div>
  )
}

Table.Tr = function Tr({
  children,
  className,
  ...props
  // onClick,
  // isSelectable,
  // isSelected,
}) {
  const { columns } = useContext(Context)
  const count = React.Children.count(children)
  const widths = calcWidths(columns || new Array(count).fill("auto"))

  return (
    <div {...props} className={cx(styles.tr, className)}>
      {React.Children.map(children, (el, i) =>
        cloneElement(el, {
          style: { width: widths[i] },
        })
      )}
    </div>
  )
}

Table.Td = function Td({ children, className, align = "left", ...props }) {
  return (
    <div
      {...props}
      className={cx(styles.td, styles[alignClassNames[align]], className)}
    >
      {children}
    </div>
  )
}

const alignClassNames = {
  left: "alignLeft",
  center: "alignCenter",
  right: "alignRight",
}

const calcWidths = columns => {
  const autoCount = columns.filter(el => el == "auto").length
  const customCols = columns.filter(el => el !== "auto").join(" + ") || "0px"

  const widths = columns.map(el =>
    el !== "auto" ? el : `calc((100% - calc(${customCols})) / ${autoCount})`
  )

  return widths
}
