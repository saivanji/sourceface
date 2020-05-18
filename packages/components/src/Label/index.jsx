import React from "react"
import styles from "./index.scss"

export default function Label({
  children,
  className,
  title,
  isOptional,
  helperMessage,
}) {
  return (
    <label className={className}>
      <span className={styles.title}>
        {title}
        {isOptional && <span className={styles.optional}>(optional)</span>}
      </span>
      {children}
      {helperMessage && <span className={styles.helper}>{helperMessage}</span>}
    </label>
  )
}
