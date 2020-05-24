import React from "react"
import cx from "classnames"
import styles from "./index.scss"

// TODO: use ul/li
export default function List({ children, className, ...props }) {
  return (
    <div {...props} className={className}>
      {children}
    </div>
  )
}

List.Item = function Item({ children, className, ...props }) {
  return (
    <div {...props} className={cx(styles.item, className)}>
      {children}
    </div>
  )
}
