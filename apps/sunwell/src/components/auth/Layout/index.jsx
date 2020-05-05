import React from "react"
import styles from "./index.css"

export default ({ children }) => {
  return (
    <div className={styles.root}>
      <div className={styles.container}>
        {children}
        <span className={styles.copyright}>
          Crafted with <span>❤</span>️ by @aiven715
        </span>
      </div>
    </div>
  )
}
