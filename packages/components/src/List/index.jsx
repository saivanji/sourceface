import React from "react"
import styles from "./index.css"

export default function List({ children, className }) {
  return <div className={className}>{children}</div>
}

export function Item({ children }) {
  return <div className={styles.item}>{children}</div>
}
