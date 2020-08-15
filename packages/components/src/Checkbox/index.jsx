import React from "react"
import styles from "./index.scss"

export default function Checkbox({
  label,
  style,
  value = false,
  onChange,
  ...props
}) {
  return (
    <label style={style} className={styles.root}>
      <input
        type="checkbox"
        checked={value}
        onChange={() => {
          onChange({
            target: { value: !value },
          })
        }}
        {...props}
      />
      {label && <span className={styles.label}>{label}</span>}
    </label>
  )
}
