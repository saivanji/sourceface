import React from "react"
import cx from "classnames"
import styles from "./index.css"

export default function Sidemenu({ children, className }) {
  return <div className={cx(styles.root, className)}>{children}</div>
}

Sidemenu.Title = function Title({ children, className }) {
  return <span className={cx(styles.title, className)}>{children}</span>
}

Sidemenu.Group = function Group({ children, className }) {
  return <div className={cx(styles.group, className)}>{children}</div>
}

Sidemenu.GroupTitle = function GroupTitle({ children, className }) {
  return <span className={cx(styles.groupTitle, className)}>{children}</span>
}

Sidemenu.GroupLink = function GroupLink({
  children,
  className,
  iconBefore,
  isSelected,
  component: Component = "a",
  ...props
}) {
  return (
    <Component
      {...props}
      className={cx(styles.groupLink, isSelected && styles.selected, className)}
    >
      {iconBefore && <iconBefore.type className={styles.groupIcon} />}
      {children}
    </Component>
  )
}

Sidemenu.Back = function Back() {}

Sidemenu.Nested = function Nested() {}
