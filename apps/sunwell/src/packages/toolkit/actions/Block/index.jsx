import React from "react"
import styles from "./index.scss"

export default function Section({ title, children }) {
  return (
    <div>
      <div className={styles.head}>{title}</div>
      <div className={styles.body}>{children}</div>
    </div>
  )
}
