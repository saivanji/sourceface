import React from "react"
import Card from "../Card"
import * as styles from "./index.styles"

// TODO: should not be rendered inside a card
export default function Tabs({ children, ...props }) {
  return (
    <Card>
      <styles.Root {...props}>{children}</styles.Root>
    </Card>
  )
}

Tabs.Tab = function Tab({
  children,
  isSelected = false,
  iconAfter,
  iconBefore,
  ...props
}) {
  return (
    <styles.Tab {...props} isSelected={isSelected}>
      {iconBefore && <styles.IconBefore>{iconBefore}</styles.IconBefore>}
      {children}
      {iconAfter && <styles.IconAfter>{iconAfter}</styles.IconAfter>}
    </styles.Tab>
  )
}

Tabs.Header = styles.Header

// TODO: rename to Content
Tabs.Body = styles.Body
