import React from "react"
import cx from "classnames"
import styles from "./index.scss"

export default function Spinner({
  appearance = "dark",
  size = "normal",
  className,
  ...props
}) {
  return (
    <div
      {...props}
      className={cx(styles.root, styles[appearance], styles[size], className)}
    ></div>
  )
}
