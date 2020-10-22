import React from "react"
import cx from "classnames"
import AutosizeInput from "react-input-autosize"
import styles from "./index.scss"

export default ({ color, autoFocus, value, onChange, onDestroy }) => (
  <span className={cx(styles.root, colors[color])}>
    <AutosizeInput
      autoFocus={autoFocus}
      type="text"
      value={value}
      onChange={(e) => onChange && onChange(e.target.value)}
      onKeyDown={(e) =>
        (e.keyCode === 8 || e.keyCode === 46) && !e.target.value && onDestroy()
      }
      onBlur={(e) => onDestroy && !e.target.value && onDestroy()}
    />
  </span>
)

const colors = {
  blue: styles.blue,
  gray: styles.gray,
  beige: styles.beige,
}
