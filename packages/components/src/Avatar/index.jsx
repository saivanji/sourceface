import React from "react"
import cx from "classnames"
import styles from "./index.css"

export default ({ value, className }) => (
  <div className={cx(styles.root, className)}>{value}</div>
)
