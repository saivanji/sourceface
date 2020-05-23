import React from "react"
import * as styles from "./index.styles"
import Icon from "./assets/check.svg"

// TODO: implement indeterminate state
export default function Checkbox({
  label,
  size = "normal",
  isDisabled,
  ...props
}) {
  return (
    <label
      {...props}
      css={[styles.root, styles.sizes[size], isDisabled && styles.disabled]}
    >
      <input disabled={isDisabled} type="checkbox" />
      <span css={styles.checkbox}>
        <Icon css={styles.icon} />
      </span>
      {label && <span css={styles.label}>{label}</span>}
    </label>
  )
}
