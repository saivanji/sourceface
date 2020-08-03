import React from "react"
import styles from "./index.scss"

// near the orders page will be a button opening a modal to edit current page properties(url, etc?)
// page title is editable?
// page creation button could be near page title
export default function Editor({ children, right, onClose }) {
  return (
    <div className={styles.root}>
      <div className={styles.header}>
        Orders page
        <div>mobile | tablet | desktop</div>
        <button onClick={onClose}>Close</button>
      </div>
      <div className={styles.right}>{right}</div>
      <div className={styles.body}>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  )
}
