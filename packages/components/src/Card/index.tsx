import React from "react"
import cx from "classnames"
import styles from "./index.scss"

export default ({ children, className, size = "normal", ...props }) => (
  <div {...props} className={cx(styles.root, styles[size], className)}>
    {children}
  </div>
)
