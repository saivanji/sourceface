import React from "react"
import cx from "classnames"
import styles from "./index.scss"

export default ({ value, size = "normal", className, ...props }) => (
  <div {...props} className={cx(styles.root, styles[size], className)}>
    {value}
  </div>
)
