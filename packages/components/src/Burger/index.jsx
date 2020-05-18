import React from "react"
import cx from "classnames"
import MenuIcon from "./assets/menu.svg"
import styles from "./index.scss"

export default function Burger({
  className,
  size = "normal",
  appearance = "light",
}) {
  return (
    <div
      className={cx(styles.root, styles[appearance], styles[size], className)}
    >
      <MenuIcon className={styles.icon} />
    </div>
  )
}
