import React from "react"
import styles from "./index.css"

export default ({ children, title, isRequired, helperMessage }) => (
  <label>
    <span className={styles.title}>
      {title}
      {isRequired && " *"}
    </span>
    {children}
    {helperMessage && <span className={styles.helper}>{helperMessage}</span>}
  </label>
)
