import React from "react"
import cx from "classnames"
import styles from "./index.scss"

export default function Button({
  children,
  size = "regular",
  type = "button",
  shouldFitContainer = false,
  className,
  ...props
}) {
  return (
    <button
      {...props}
      className={cx(
        className,
        styles.root,
        styles[size],
        shouldFitContainer && styles.full
      )}
      type={type}
    >
      {children}
    </button>
  )
}
