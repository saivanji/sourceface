import React from "react"
import cx from "classnames"
import styles from "./index.css"

export default ({ children, className, size = "normal" }) => (
  <div className={cx(styles.root, styles[size], className)}>{children}</div>
)
