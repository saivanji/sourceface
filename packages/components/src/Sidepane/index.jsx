import React from "react"
import cx from "classnames"
import styles from "./index.css"

export default function Sidepane({ children, className }) {
  return <div className={cx(styles.root, className)}>{children}</div>
}

Sidepane.Logo = function Logo({ children, className }) {
  return <div className={cx(styles.logo, className)}>{children}</div>
}

Sidepane.Link = function Link({
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
