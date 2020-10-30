import React from "react"
import styles from "./index.scss"

// near the orders page will be a button opening a modal to edit current page properties(url, etc?)
// page title is editable?
// page creation button could be near page title, also page title is a select which has all pages inside
export default function EditorView({ children, isSaving, right, onClose }) {
  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <span className={styles.title}>Orders page</span>
        <div>mobile | tablet | desktop</div>
        <div>
          {isSaving && "Saving..."}
          <button onClick={onClose}>Close</button>
        </div>
      </div>
      <div className={styles.right}>{right}</div>
      <div className={styles.body}>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  )
}
