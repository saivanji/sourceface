import React from "react"
import cx from "classnames"
import styles from "./index.css"

// side view is not a table feature. it should be implemented somewhere else, but it's a feature of table module

// table should not have so much features, complex tables should be implemented by a components composition instead. for example compose to a table side view, collapse or pagination, filters and so on
// table should have checkboxes and sorting at max probably.

// TODO: implement multiple sizes

export default function Table({ children, className }) {
  return <div className={className}>{children}</div>
}

Table.Head = function Head({ children, className }) {
  return <div className={cx(styles.head, className)}>{children}</div>
}

Table.Heading = function Heading({ children, className, align = "left" }) {
  return (
    <div
      className={cx(styles.heading, styles[alignClassNames[align]], className)}
    >
      {children}
    </div>
  )
}

Table.Body = function Body({ children, className }) {
  return <div className={cx(styles.body, className)}>{children}</div>
}

Table.Row = function Row({
  children,
  className,
  onClick,
  isSelectable,
  isSelected,
}) {
  return <div className={cx(styles.row, className)}>{children}</div>
}

Table.Cell = function Cell({ children, className, align = "left" }) {
  return (
    <div className={cx(styles.cell, styles[alignClassNames[align]], className)}>
      {children}
    </div>
  )
}

const alignClassNames = {
  left: "alignLeft",
  center: "alignCenter",
  right: "alignRight",
}
