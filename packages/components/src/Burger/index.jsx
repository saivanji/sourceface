import React from "react"
import * as styles from "./index.styles"

export default function Burger(props) {
  return (
    <styles.Root {...props}>
      <styles.Icon />
    </styles.Root>
  )
}

Burger.defaultProps = {
  isActive: false,
  size: "normal",
  appearance: "primary",
}
