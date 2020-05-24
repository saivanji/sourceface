import React from "react"
import cx from "classnames"
import Card from "../Card"
import styles from "./index.scss"

// TODO: should not be rendered inside a card
export default function Tabs({ children, className, ...props }) {
  return (
    <Card>
      <div {...props} className={cx(styles.root, className)}>
        {children}
      </div>
    </Card>
  )
}

Tabs.Tab = function Tab({
  children,
  isSelected,
  iconAfter,
  iconBefore,
  ...props
}) {
  return (
    <button
      {...props}
      className={cx(styles.item, isSelected && styles.selected)}
    >
      {iconBefore && <div className={styles.iconBefore}>{iconBefore}</div>}
      {children}
      {iconAfter && <div className={styles.iconAfter}>{iconAfter}</div>}
    </button>
  )
}

Tabs.Header = function Header({ children, ...props }) {
  return (
    <div {...props} className={styles.header}>
      {children}
    </div>
  )
}

// TODO: rename to Content
Tabs.Body = function Body({ children, ...props }) {
  return (
    <div {...props} className={styles.body}>
      {children}
    </div>
  )
}
