import React from "react"
import cx from "classnames"
import styles from "./index.css"

export default ({ appearance = "dark", className }) => (
  <div className={cx(styles.root, styles[appearance], className)}></div>
)
