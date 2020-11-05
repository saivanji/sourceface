import React from "react"
import cx from "classnames"
import Delete from "assets/delete.svg"
import styles from "./index.scss"

export default ({ children, prefix, color, removable, onRemove }) => {
  return (
    <div className={styles.root}>
      {prefix && (
        <span className={cx(styles.item, styles.prefix, colors[prefix.color])}>
          {prefix.text}
        </span>
      )}
      <span className={cx(styles.item, colors[color])}>{children}</span>
      {removable && (
        <span className={styles.remove}>
          <Delete
            onClick={(e) => {
              e.stopPropagation()
              onRemove()
            }}
          />
        </span>
      )}
    </div>
  )
}

const colors = {
  blue: styles.blue,
  gray: styles.gray,
  beige: styles.beige,
}
