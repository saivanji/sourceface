import React from "react"
import styles from "./index.scss"

export default function Text({ children }) {
  return <span className={styles.root}>{children}</span>
}
