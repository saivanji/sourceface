import React from "react"
import cx from "classnames"
import styles from "./index.scss"

export default function Header({
  children,
  appearance = "light",
  size = "normal",
  className,
  ...props
}) {
  return (
    <div
      {...props}
      className={cx(styles.root, styles[appearance], styles[size], className)}
    >
      {children}
    </div>
  )
}