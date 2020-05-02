import React from "react"
import cx from "classnames"
import styles from "./index.css"
import CheckIcon from "./check.svg"

export default function Checkbox({ label, size = "normal", isDisabled }) {
  return (
    <label
      className={cx(
        styles.root,

        isDisabled && styles.disabled
      )}
    >
      <input disabled={isDisabled} type="checkbox" />
      <span className={cx(styles.checkbox, styles[size])}>
        <CheckIcon className={styles.icon} />
      </span>
      {label && <span className={styles.label}>{label}</span>}
    </label>
  )
}
