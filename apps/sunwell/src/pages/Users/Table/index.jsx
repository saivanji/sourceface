import React, { createContext, useContext } from "react"
import cx from "classnames"
import styles from "./index.scss"

// side view is not a table feature. it should be implemented somewhere else, but it's a feature of table module

// table should not have so much features, complex tables should be implemented by a components composition instead. for example compose to a table side view, collapse or pagination, filters and so on
// table should have checkboxes and sorting at max probably.

// TODO: implement multiple sizes

const Context = createContext("table")

export default function Table({ children, className, size }) {
  return (
    <Context.Provider value={{ size }}>
      <div className={cx(styles.root, className)}>{children}</div>
    </Context.Provider>
  )
}

Table.Head = function Head({ children, className }) {
  const { size } = useContext(Context)
  console.log(defaultSize(children))

  return (
    <div style={{}} className={cx(styles.head, className)}>
      {children}
    </div>
  )
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

Table.Row = function Row({
  children,
  className,
  // onClick,
  // isSelectable,
  // isSelected,
}) {
  const { size } = useContext(Context)
  return (
    <div style={{}} className={cx(styles.row, className)}>
      {children}
    </div>
  )
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

const defaultSize = children =>
  React.Children.map(
    children,
    () => `calc(100% / ${React.Children.count(children)})`
  )
