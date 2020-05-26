import React from "react"
import cx from "classnames"
import styles from "./index.scss"

export default ({
  value,
  appearance = "dark",
  shape = "rounded",
  className,
  ...props
}) => (
  <span
    {...props}
    className={cx(className, styles.root, styles[appearance], styles[shape])}
  >
    {value}
  </span>
)