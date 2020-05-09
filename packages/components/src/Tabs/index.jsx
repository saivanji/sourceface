import React from "react"
import cx from "classnames"
import styles from "./index.css"

export default function Tabs({ children, className }) {
  return <div className={cx(styles.root, className)}>{children}</div>
}

export function Tab({ children, isSelected, iconAfter, iconBefore }) {
  return (
    <button className={cx(styles.item, isSelected && styles.selected)}>
      {iconBefore && <div className={styles.iconBefore}>{iconBefore}</div>}
      {children}
      {iconAfter && <div className={styles.iconAfter}>{iconAfter}</div>}
    </button>
  )
}
