import React from "react"
import * as styles from "./index.styles"

export default function Root({ size = "normal", children }) {
  return <div css={[styles.root, styles.sizes[size]]}>{children}</div>
}
