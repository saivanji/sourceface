import React from "react"
import cx from "classnames"
import styles from "./index.css"

export default function Sidebar({ children, className }) {
  return <div className={cx(styles.root, className)}>{children}</div>
}

Sidebar.PaneLogo = function Logo({ children, className }) {
  return <div className={cx(styles.paneLogo, className)}>{children}</div>
}

Sidebar.Pane = function Pane({ children, className }) {
  return <div className={cx(styles.pane, className)}>{children}</div>
}

Sidebar.PaneLink = function PaneLink({
  children,
  className,
  isSelected,
  component: Component = "a",
  ...props
}) {
  return (
    <Component
      {...props}
      className={cx(styles.paneLink, isSelected && styles.selected, className)}
    >
      {children}
    </Component>
  )
}

Sidebar.Menu = function Menu({ children, className }) {
  return <div className={cx(styles.menu, className)}>{children}</div>
}

Sidebar.MenuTitle = function MenuTitle({ children, className }) {
  return <span className={cx(styles.menuTitle, className)}>{children}</span>
}

Sidebar.Group = function Group({ children, className }) {
  return <div className={cx(styles.group, className)}>{children}</div>
}

Sidebar.GroupTitle = function Group({ children, className }) {
  return <span className={cx(styles.groupTitle, className)}>{children}</span>
}

Sidebar.GroupLink = function GroupLink({
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
