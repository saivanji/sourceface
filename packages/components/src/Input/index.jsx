import React from "react"
import cx from "classnames"
import styles from "./index.scss"

export default function Input({
  size = "normal",
  className,
  iconAfter,
  iconBefore,
  error,
  ...props
}) {
  return (
    <div className={cx(styles.root, styles[size], className)}>
      <div className={styles.wrap}>
        {iconBefore && <div className={styles.iconBefore}>{iconBefore}</div>}
        <input
          className={cx(
            styles.element,
            error && styles.error,
            iconBefore && styles.hasIconBefore,
            iconAfter && styles.hasIconAfter
          )}
          {...props}
        />
        {iconAfter && <div className={styles.iconAfter}>{iconAfter}</div>}
      </div>
      {error && <div className={styles.errorText}>{error}</div>}
    </div>
  )
}
