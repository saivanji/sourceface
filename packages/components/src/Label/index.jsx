import React from "react"
import * as styles from "./index.styles"

export default function Label({
  children,
  title,
  isOptional,
  helperMessage,
  ...props
}) {
  return (
    <label {...props}>
      <span css={styles.title}>
        {title}
        {isOptional && <span css={styles.optional}>(optional)</span>}
      </span>
      {children}
      {helperMessage && <span css={styles.helper}>{helperMessage}</span>}
    </label>
  )
}
