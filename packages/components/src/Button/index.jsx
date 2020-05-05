import React from "react"
import cx from "classnames"
import Spinner from "../Spinner"
import styles from "./index.css"

export default function Button({
  children,
  appearance = "primary",
  size = "normal",
  type = "button",
  shouldFitContainer = false,
  isDisabled,
  isLoading,
  className,
  // iconAfter,
  // iconBefore,
}) {
  return (
    <button
      className={cx(
        className,
        styles.root,
        shouldFitContainer && styles.full,
        isDisabled
          ? appearance !== "link"
            ? styles.disabled
            : styles.disabledLink
          : styles[appearance],
        appearance !== "link" && styles[size]
      )}
      disabled={isDisabled}
      type={type}
    >
      {isLoading && <Spinner appearance="dark" className={styles.spinner} />}
      {children}
    </button>
  )
}
