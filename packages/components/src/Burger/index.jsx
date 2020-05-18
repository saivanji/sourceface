import React from "react"
import cx from "classnames"
import MenuIcon from "assets/menu.svg"
import styles from "./index.scss"

export default function Burger({ className, appearance = "light" }) {
  return (
    <div className={cx(styles.root, styles[appearance], className)}>
      <MenuIcon className={styles.icon} />
    </div>
  )
}
