import React from "react"
import MenuIcon from "./assets/menu.svg"
import * as styles from "./index.styles"

export default function Burger({
  isActive,
  size = "normal",
  variant = "light",
  ...props
}) {
  return (
    <div
      {...props}
      css={[
        styles.root,
        styles.variants[variant],
        styles.sizes[size],
        isActive && styles.active,
      ]}
    >
      <MenuIcon css={styles.icon} />
    </div>
  )
}
