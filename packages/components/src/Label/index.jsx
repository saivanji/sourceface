import React from "react"
import styles from "./index.scss"

export default ({ title, children }) => (
  <div>
    <div>
      <span className={styles.title}>{title}</span>
    </div>
    {children}
  </div>
)
