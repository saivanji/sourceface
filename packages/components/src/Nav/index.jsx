import React from "react"
import * as styles from "./index.styles"

// TODO: implement light appearance
export default styles.Root

styles.Root.Logo = styles.Logo

styles.Root.Link = function Link({
  children,
  isSelected,
  component: Component = "a",
  ...props
}) {
  return (
    <Component {...props}>
      <styles.Link isSelected={isSelected}>{children}</styles.Link>
    </Component>
  )
}
