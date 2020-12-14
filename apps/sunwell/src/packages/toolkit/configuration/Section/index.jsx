import React from "react"
import styles from "./index.scss"

export default function Section({ title, children }) {
  return (
    <div className={styles.root}>
      <span className={styles.title}>{title}</span>
      {children}
    </div>
  )
}
