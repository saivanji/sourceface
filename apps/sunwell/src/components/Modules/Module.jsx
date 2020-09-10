import React from "react"
import cx from "classnames"
import styles from "./index.scss"

export default ({
  isEditable,
  isSelected,
  onClick,
  component: Component,
  components,
  data,
}) => {
  return (
    <div
      onClick={e => {
        if (onClick) {
          /**
           * Propagating click events in order to be able to click on nested module
           */
          e.stopPropagation()
          onClick(data.id)
        }
      }}
      className={cx(
        styles.module,
        isEditable && styles.editable,
        isSelected && styles.selected
      )}
    >
      <Component
        config={data.config}
        layouts={data.layouts}
        components={components}
      />
    </div>
  )
}
