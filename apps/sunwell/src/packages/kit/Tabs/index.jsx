import React from "react"
import cx from "classnames"
import styles from "./index.scss"

export default function Tabs({ children, className, ...props }) {
  return (
    <div {...props} className={cx(styles.root, className)}>
      {children}
    </div>
  )
}

Tabs.Tab = function Tab({ children, isSelected, ...props }) {
  return (
    <button
      {...props}
      className={cx(styles.item, isSelected && styles.selected)}
    >
      {children}
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
