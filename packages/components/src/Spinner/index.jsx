import React from "react"
import cx from "classnames"
import styles from "./index.css"

export default function Spinner({ appearance = "dark", className }) {
  return <div className={cx(styles.root, styles[appearance], className)}></div>
}
