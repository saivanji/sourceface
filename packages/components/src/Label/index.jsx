import React from "react"
import * as styles from "./index.styles"

export default function Label({
  children,
  className,
  title,
  isOptional,
  helperMessage,
  ...props
}) {
  return (
    <label {...props} className={className}>
      <styles.Title>
        {title}
        {isOptional && <styles.Optional>(optional)</styles.Optional>}
      </styles.Title>
      {children}
      {helperMessage && <styles.Helper>{helperMessage}</styles.Helper>}
    </label>
  )
}
