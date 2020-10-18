import React from "react"
import cx from "classnames"
import AutosizeInput from "react-input-autosize"
import styles from "./index.scss"

export default ({ icon, color, autoFocus, value, onChange }) => (
  <span className={cx(styles.root, colors[color])}>
    {icon && <span className={styles.icon}>{icon}</span>}
    <AutosizeInput
      autoFocus={autoFocus}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </span>
)

const colors = {
  blue: styles.blue,
  gray: styles.gray,
  beige: styles.beige,
}
