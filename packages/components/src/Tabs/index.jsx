import React from "react"
import Card from "../Card"
import * as styles from "./index.styles"

// TODO: should not be rendered inside a card
export default function Tabs({ children, ...props }) {
  return (
    <Card>
      <div {...props} css={styles.root}>
        {children}
      </div>
    </Card>
  )
}

Tabs.Tab = function Tab({
  children,
  isSelected,
  iconAfter,
  iconBefore,
  ...props
}) {
  return (
    <button {...props} css={[styles.tab, isSelected && styles.selected]}>
      {iconBefore && <div css={styles.iconBefore}>{iconBefore}</div>}
      {children}
      {iconAfter && <div css={styles.iconAfter}>{iconAfter}</div>}
    </button>
  )
}

Tabs.Header = function Header({ children, ...props }) {
  return (
    <div {...props} css={styles.header}>
      {children}
    </div>
  )
}

// TODO: rename to Content
Tabs.Body = function Body({ children, ...props }) {
  return (
    <div {...props} css={styles.body}>
      {children}
    </div>
  )
}
