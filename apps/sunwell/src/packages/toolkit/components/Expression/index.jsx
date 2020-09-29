import React from "react"
import styles from "./index.scss"

// TODO: if value is array, then act as a pipline, othewise single element
// TODO: when created new item in a pipeline, have "acc/result/prev ->" as a placeholder
export default ({ error, ...props }) => (
  <>
    <div className={styles.root}>
      <input type="text" className={styles.input} {...props} />
      <span className={styles.plus}>+</span>
    </div>
    {error && <span className={styles.error}>{error}</span>}
  </>
)
