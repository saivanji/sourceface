import React from "react"
import cx from "classnames"
import styles from "./index.css"

export default function Spinner({
  appearance = "dark",
  size = "normal",
  className,
}) {
  return (
    <div
      className={cx(styles.root, styles[appearance], styles[size], className)}
    ></div>
  )
}
