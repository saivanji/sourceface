import React from "react"
import cx from "classnames"
import styles from "./index.css"

export default ({ className }) => (
  <div className={cx(styles.root, className)}>
    <Tab isSelected>Users</Tab>
    <Tab>Invitations</Tab>
  </div>
)

export const Tab = ({ children, isSelected }) => (
  <button className={cx(styles.item, isSelected && styles.selected)}>
    {children}
  </button>
)
