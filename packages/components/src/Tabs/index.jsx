import React from "react"
import cx from "classnames"
import Card from "../Card"
import styles from "./index.css"

export default function Tabs({ children, className }) {
  return (
    <Card>
      <div className={cx(styles.root, className)}>{children}</div>
    </Card>
  )
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

export function TabsHead({ children }) {
  return <div className={styles.head}>{children}</div>
}

export function TabsBody({ children }) {
  return <div className={styles.body}>{children}</div>
}
