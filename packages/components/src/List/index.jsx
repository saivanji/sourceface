import React from "react"
import cx from "classnames"
import styles from "./index.css"

export default function List({ children, className }) {
  return <div className={className}>{children}</div>
}

export function Item({ children, className }) {
  return <div className={cx(styles.item, className)}>{children}</div>
}
