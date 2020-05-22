import React from "react"
import * as styles from "./index.styles"

// TODO: define bg/color at the root component(in css with nesting) and not for the children. Make sure the rest components in the kit are following that convention
// TODO: implement light appearance
export default styles.Root

// TODO: add iconBefore prop
styles.Root.Title = styles.Title

// TODO: have title here and remove GroupTitle?
styles.Root.Group = styles.Group

styles.Root.GroupTitle = styles.GroupTitle

// TODO: rename to Link
styles.Root.GroupLink = function GroupLink({
  children,
  iconBefore,
  isSelected,
  component: Component = "a",
  ...props
}) {
  const iconType = iconBefore && (iconBefore.type || "span")

  return (
    <Component {...props}>
      <styles.GroupLink isSelected={isSelected}>
        {iconBefore && <iconType className={styles.GroupIcon} />}
        {children}
      </styles.GroupLink>
    </Component>
  )
}

styles.Root.Back = function Back() {}

styles.Root.Switcher = function Switcher() {}
