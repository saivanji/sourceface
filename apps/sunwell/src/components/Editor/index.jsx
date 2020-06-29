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
        {selectedModule
          ? JSON.stringify(selectedModule, null, 2)
          : "All modules list"}
      </div>
    </div>
  )
}
