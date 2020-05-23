import React from "react"
import * as styles from "./index.styles"

// TODO: define bg/color at the root component(in css with nesting) and not for the children. Make sure the rest components in the kit are following that convention
// TODO: implement light variant
export default function Sidebar({ children, ...props }) {
  return (
    <div {...props} css={styles.root}>
      {children}
    </div>
  )
}

// TODO: add iconBefore prop
Sidebar.Title = function Title({ children, ...props }) {
  return (
    <span {...props} css={styles.title}>
      {children}
    </span>
  )
}

// TODO: have title here and remove GroupTitle?
Sidebar.Group = function Group({ children, ...props }) {
  return (
    <div {...props} css={styles.group}>
      {children}
    </div>
  )
}

Sidebar.GroupTitle = function GroupTitle({ children, ...props }) {
  return (
    <span {...props} css={styles.groupTitle}>
      {children}
    </span>
  )
}

// TODO: rename to Link
Sidebar.GroupLink = function GroupLink({
  children,

  iconBefore,
  isSelected,
  component: Component = "a",
  ...props
}) {
  return (
    <Component
      {...props}
      css={[styles.groupLink, isSelected && styles.selected]}
    >
      {iconBefore && <iconBefore.type css={styles.groupIcon} />}
      {children}
    </Component>
  )
}

Sidebar.Back = function Back() {}

Sidebar.Switcher = function Switcher() {}
