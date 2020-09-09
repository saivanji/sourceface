import React from "react"
import styles from "./index.scss"

export default ({ error, ...props }) => (
  <>
    <input type="text" className={styles.expression} {...props} />
    {error && <span className={styles.errorMessage}>{error}</span>}
  </>
)
