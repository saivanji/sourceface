import React from "react"
import cx from "classnames"
import styles from "./index.css"

export default ({
  size = "normal",
  shouldFitContainer = false,
  iconAfter,
  // iconBefore,
  error,
  ...props
}) => (
  <>
    <div className={styles.root}>
      <input
        className={cx(
          styles.element,
          styles[size],
          shouldFitContainer && styles.full,
          error && styles.error
        )}
        {...props}
      />
      {iconAfter && <div className={styles.iconAfter}>{iconAfter}</div>}
    </div>
    {error && <div className={styles.errorText}>{error}</div>}
  </>
)
