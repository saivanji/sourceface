import React from "react"
import cx from "classnames"
import styles from "./index.css"

export default ({ children, className }) => (
  <button className={cx(styles.root, className)}>{children}</button>
)
