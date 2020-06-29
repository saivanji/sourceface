import React from "react"
import styles from "./index.scss"

export default ({ children, selectedModule, onCancel }) => {
  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <button onClick={onCancel}>Cancel</button>
      </div>
      <div className={styles.body}>{children}</div>
      <div className={styles.modules}>
        {selectedModule || "All modules list"}
      </div>
    </div>
  )
}
