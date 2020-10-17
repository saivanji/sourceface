import React from "react"
import cx from "classnames"
import styles from "./index.scss"

export default ({ children, icon, color }) => (
  <span className={cx(styles.root, colors[color])}>
    {icon && <span className={styles.icon}>{icon}</span>}
    {children}
  </span>
)

const colors = {
  blue: styles.blue,
  gray: styles.gray,
  beige: styles.beige,
}
