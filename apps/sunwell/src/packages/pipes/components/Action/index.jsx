import React from "react"
import styles from "./index.scss"

export default function Action({ children }) {
  return (
    <div className={styles.root}>
      {children}
      <span className={styles.add}>+</span>
    </div>
  )
}
