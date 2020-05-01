import React from "react"
import styles from "./index.css"

export default function Checkbox({ label }) {
  return (
    <label className={styles.root}>
      <input type="checkbox" />
      {label && <span className={styles.label}>{label}</span>}
    </label>
  )
}
