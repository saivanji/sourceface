import React from "react"
import styles from "./index.scss"

export default function Checkbox({
  text,
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
      {text && <span className={styles.text}>{text}</span>}
    </label>
  )
}
