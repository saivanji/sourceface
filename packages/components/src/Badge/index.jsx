import React from "react"
import * as styles from "./index.styles"

export default ({ value, variant = "light", shape = "rounded", ...props }) => (
  <span
    {...props}
    css={[styles.root, styles.variants[variant], styles.shapes[shape]]}
  >
    {value}
  </span>
)
