import React from "react"
import styles from "./index.css"

// TODO: have isOptional instead and display (optional) label for that
export default function Label({
  children,
  className,
  title,
  isRequired,
  helperMessage,
}) {
  return (
    <label className={className}>
      <span className={styles.title}>
        {title}
        {isRequired && " *"}
      </span>
      {children}
      {helperMessage && <span className={styles.helper}>{helperMessage}</span>}
    </label>
  )
}
