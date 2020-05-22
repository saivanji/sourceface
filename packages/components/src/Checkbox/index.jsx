import React from "react"
import * as styles from "./index.styles"

// TODO: implement indeterminate state
export default function Checkbox({ label, ...props }) {
  return (
    <styles.Root {...props}>
      <input disabled={props.isDisabled} type="checkbox" />
      <styles.Checkbox>
        <styles.Icon />
      </styles.Checkbox>
      {label && <styles.Label>{label}</styles.Label>}
    </styles.Root>
  )
}

Checkbox.defaultProps = {
  size: "normal",
  isDisabled: false,
}
