import React from "react"
import cx from "classnames"
import styles from "./index.scss"

// TODO: implement light appearance
export default function Nav({ children, className, ...props }) {
  return (
    <div {...props} className={cx(styles.root, className)}>
      {children}
    </div>
  )
}

Nav.Logo = function Logo({ children, className, ...props }) {
  return (
    <div {...props} className={cx(styles.logo, className)}>
      {children}
    </div>
  )
}

Nav.Link = function Link({
  children,
  className,
  isSelected,
  component: Component = "a",
  ...props
}) {
  return (
    <Component
      {...props}
      className={cx(styles.link, isSelected && styles.selected, className)}
    >
      {children}
    </Component>
  )
}
