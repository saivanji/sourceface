import React from "react"
import cx from "classnames"
import styles from "./index.css"

export default function Input({
  size = "normal",
  iconAfter,
  // iconBefore,
  error,
  ...props
}) {
  return (
    <>
      <div className={styles.root}>
        <input
          className={cx(styles.element, styles[size], error && styles.error)}
          {...props}
        />
        {iconAfter && <div className={styles.iconAfter}>{iconAfter}</div>}
      </div>
      {error && <div className={styles.errorText}>{error}</div>}
    </>
  )
}
