import React from "react"
import * as styles from "./index.styles"

// TODO: use ul/li
export default function List({ children, ...props }) {
  return <div {...props}>{children}</div>
}

List.Item = function Item({ children, ...props }) {
  return (
    <div {...props} css={styles.item}>
      {children}
    </div>
  )
}
