import React from "react"
import cx from "classnames"
import styles from "./index.css"

export default function Input({
  size = "normal",
  className,
  iconAfter,
  // iconBefore,
  error,
  ...props
}) {
  return (
    <>
      <div className={cx(styles.root, styles[size], className)}>
        <input
          className={cx(styles.element, error && styles.error)}
          {...props}
        />
        {iconAfter && <div className={styles.iconAfter}>{iconAfter}</div>}
      </div>
      {error && <div className={styles.errorText}>{error}</div>}
    </>
  )
}
