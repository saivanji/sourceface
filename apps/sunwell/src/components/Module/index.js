import React from "react"
import cx from "classnames"
import styles from "./styles.scss"

export default ({
  isEditable,
  isSelected,
  onClick,
  component: Component,
  expression,
  data,
}) => {
  return (
    <div
      onClick={() => onClick && onClick(data.id)}
      className={cx(
        styles.root,
        isEditable && styles.editable,
        isSelected && styles.selected
      )}
    >
      <Component config={data.config} expression={expression} />
    </div>
  )
}
