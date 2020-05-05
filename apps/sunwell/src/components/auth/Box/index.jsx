import React from "react"
import styles from "./index.css"

export default ({ children, title, description }) => (
  <div className={styles.root}>
    <span className={styles.title}>{title}</span>
    <span className={styles.description}>{description}</span>
    {children}
  </div>
)
