import React from "react"
import cx from "classnames"
import styles from "./index.scss"

// TODO: whether using "trail" is correct?
export default ({ className, title, trail }) => (
  <div className={cx(className, styles.line)}>
    <span className={styles.title}>{title}</span>
    {trail && <div className={styles.trail}>{trail}</div>}
  </div>
)
