import React from "react"
import cx from "classnames"
import MenuIcon from "./assets/menu.svg"
import styles from "./index.scss"

export default function Burger({
  className,
  isActive,
  size = "normal",
  appearance = "light",
  ...props
}) {
  return (
    <div
      {...props}
      className={cx(
        styles.root,
        styles[appearance],
        styles[size],
        isActive && styles.active,
        className
      )}
    >
      <MenuIcon className={styles.icon} />
    </div>
  )
}
