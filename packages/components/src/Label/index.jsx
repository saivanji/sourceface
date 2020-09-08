import React from "react"
import styles from "./index.scss"

// TODO: whether using "end" is correct?
export default ({ title, children, end }) => (
  <div>
    <div className={styles.line}>
      <span className={styles.title}>{title}</span>
      {end && <div className={styles.end}>{end}</div>}
    </div>
    {children}
  </div>
)
