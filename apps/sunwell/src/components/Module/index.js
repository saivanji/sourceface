import React, { memo } from "react"
import cx from "classnames"
import styles from "./styles.scss"

export default memo(
  ({
    isEditable,
    isSelected,
    onClick,
    component: Component,
    expression: Expression,
    data,
  }) => {
    return (
      <div
        onClick={() => onClick(data.id)}
        className={cx(
          styles.root,
          isEditable && styles.editable,
          isSelected && styles.selected
        )}
      >
        <Component config={data.config} e={Expression} />
      </div>
    )
  }
)
