import React from "react"
import cx from "classnames"
import styles from "./index.scss"

export default ({
  size = "normal",
  mode = "light",
  value,
  className,
  ...props
}) => (
  <div
    {...props}
    className={cx(styles.root, styles[mode], styles[size], className)}
  >
    {value}
  </div>
)
