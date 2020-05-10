import React from "react"
import cx from "classnames"
import styles from "./index.css"

export default ({ children, size = "normal" }) => (
  <div className={cx(styles.root, styles[size])}>{children}</div>
)
