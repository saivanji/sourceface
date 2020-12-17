import React from "react"
import cx from "classnames"
import styles from "./index.scss"

// TODO: test whether the css is compatible with all way html table can be used

export default function Table({ children, className, ...props }) {
  return (
    <table {...props} className={cx(styles.root, className)}>
      {children}
    </table>
  )
}

Table.Thead = function Thead({ children, className, ...props }) {
  return (
    <thead {...props} className={cx(styles.thead, className)}>
      {children}
    </thead>
  )
}

Table.Tfoot = function Tfoot({ children, className, ...props }) {
  return (
    <tfoot {...props} className={cx(styles.tfoot, className)}>
      {children}
    </tfoot>
  )
}

Table.Tbody = function Thead({ children, className, ...props }) {
  return (
    <tbody {...props} className={cx(styles.tbody, className)}>
      {children}
    </tbody>
  )
}

Table.Th = function Th({ children, className, ...props }) {
  return (
    <th {...props} className={cx(styles.th, className)}>
      {children}
    </th>
  )
}

Table.Tr = function Tr({ children, className, hover, ...props }) {
  return (
    <tr {...props} className={cx(styles.tr, hover && styles.hover, className)}>
      {children}
    </tr>
  )
}

Table.Td = function Td({ children, className, ...props }) {
  return (
    <td {...props} className={cx(styles.td, className)}>
      {children}
    </td>
  )
}
