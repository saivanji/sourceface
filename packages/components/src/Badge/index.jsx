import React from "react"
import cx from "classnames"
import styles from "./index.css"

export default ({ value, appearance = "dark", shape = "rounded" }) => (
  <span className={cx(styles.root, styles[appearance], styles[shape])}>
    {value}
  </span>
)
