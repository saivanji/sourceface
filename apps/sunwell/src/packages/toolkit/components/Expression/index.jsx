import React from "react"
import styles from "./index.scss"

export default ({ error, ...props }) => (
  <>
    <input type="text" className={styles.root} {...props} />
    {error && <span className={styles.error}>{error}</span>}
  </>
)
