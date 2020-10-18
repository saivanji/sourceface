import React from "react"
import cx from "classnames"
import styles from "./index.scss"

export default function Button({
  children,
  icon,
  size = "regular",
  type = "button",
  appearance = "primary",
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
        styles[appearance],
        shouldFitContainer && styles.full
      )}
      type={type}
    >
      {icon && <span className={styles.icon}>{icon}</span>}
      {children}
    </button>
  )
}
