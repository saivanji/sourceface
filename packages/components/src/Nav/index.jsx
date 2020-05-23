import React from "react"
import * as styles from "./index.styles"

// TODO: implement light variant
export default function Nav({ children, ...props }) {
  return (
    <div {...props} css={styles.root}>
      {children}
    </div>
  )
}

Nav.Logo = function Logo({ children, ...props }) {
  return (
    <div {...props} css={styles.logo}>
      {children}
    </div>
  )
}

Nav.Link = function Link({
  children,
  isSelected,
  component: Component = "a",
  ...props
}) {
  return (
    <Component {...props} css={[styles.link, isSelected && styles.selected]}>
      {children}
    </Component>
  )
}
