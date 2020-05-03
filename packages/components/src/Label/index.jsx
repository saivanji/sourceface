import React from "react"
import styles from "./index.css"

export default function Label({ children, title, isRequired, helperMessage }) {
  return (
    <label>
      <span className={styles.title}>
        {title}
        {isRequired && " *"}
      </span>
      {children}
      {helperMessage && <span className={styles.helper}>{helperMessage}</span>}
    </label>
  )
}
