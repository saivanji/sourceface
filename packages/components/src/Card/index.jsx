import React from "react"
import * as styles from "./index.styles"

export default ({ children, size = "normal", ...props }) => (
  <div {...props} css={[styles.root, styles.sizes[size]]}>
    {children}
  </div>
)
