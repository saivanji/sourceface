import React from "react"
import cx from "classnames"
import styles from "./index.css"

export default function Link({ children, className }) {
  return <button className={cx(styles.root, className)}>{children}</button>
}
