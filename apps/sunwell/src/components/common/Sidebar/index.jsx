import React from "react"
import styles from "./index.css"

export default function Sidebar() {
  return (
    <div className={styles.root}>
      <div className={styles.line}>
        <div className={styles.logo} />
        <div className={styles.lineWrap}></div>
      </div>
      <div className={styles.menu}>
        <span className={styles.productName}>Sourceface</span>
      </div>
    </div>
  )
}
