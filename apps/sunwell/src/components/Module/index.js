import React from "react"
import cx from "classnames"
import styles from "./styles.scss"

export default ({ children, isSelected, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={cx(styles.root, isSelected && styles.selected)}
    >
      {children}
    </div>
  )
}
