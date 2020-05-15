import React from "react"
import cx from "classnames"
import styles from "./index.css"
import Icon from "./assets/check.svg"

// TODO: implement indeterminate state
export default function Checkbox({ label, size = "normal", isDisabled }) {
  return (
    <label
      className={cx(styles.root, styles[size], isDisabled && styles.disabled)}
    >
      <input disabled={isDisabled} type="checkbox" />
      <span className={styles.checkbox}>
        <Icon className={styles.icon} />
      </span>
      {label && <span className={styles.label}>{label}</span>}
    </label>
  )
}
