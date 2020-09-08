import React from "react"
import styles from "./index.scss"

// TODO: whether using "trail" is correct?
export default ({ title, children, trail }) => (
  <div>
    <div className={styles.line}>
      <span className={styles.title}>{title}</span>
      {trail && <div className={styles.trail}>{trail}</div>}
    </div>
    {children}
  </div>
)
