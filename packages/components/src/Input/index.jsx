import React from "react"
import styles from "./index.scss"

export default ({ error, ...props }) => (
  <>
    <input {...props} />
    {error && <span className={styles.error}>{error}</span>}
  </>
)
