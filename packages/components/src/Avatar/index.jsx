import React from "react"
import * as styles from "./index.styles"

export default ({ value, size = "normal", ...props }) => (
  <div {...props} css={[styles.root, styles.sizes[size]]}>
    {value}
  </div>
)
