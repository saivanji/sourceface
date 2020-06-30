import React from "react"
import cx from "classnames"
import styles from "./styles.scss"

export default ({ children, isEditable, isSelected, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={cx(
        styles.root,
        isEditable && styles.editable,
        isSelected && styles.selected
      )}
    >
      {children}
    </div>
  )
}
