import React from "react"
import * as styles from "./index.styles"

// TODO: use ul/li
export default function List({ children, className, ...props }) {
  return (
    <div {...props} className={className}>
      {children}
    </div>
  )
}

List.Item = styles.Item

styles.Item.displayName = "Item"
