import React from "react"
import styles from "./index.scss"

export default ({ error, ...props }) => (
  <>
    <div className={styles.root}>
      <input type="text" className={styles.input} {...props} />
      <span className={styles.plus}>+</span>
    </div>
    {error && <span className={styles.error}>{error}</span>}
  </>
)
