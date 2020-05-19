import React from "react"
import cx from "classnames"
import MenuIcon from "./assets/menu.svg"
import styles from "./index.scss"

export default function Burger({
  className,
  onClick,
  isActive,
  size = "normal",
  appearance = "light",
}) {
  return (
    <div
      className={cx(
        styles.root,
        styles[appearance],
        styles[size],
        isActive && styles.active,
        className
      )}
      onClick={onClick}
    >
      <MenuIcon className={styles.icon} />
    </div>
  )
}
