import React from "react"
import styles from "./index.scss"

export default function Action({ children, type, name }) {
  return (
    <div className={styles.root}>
      <div className={styles.head}>
        <span className={styles.type}>{type}</span>
        <span className={styles.name}>{name}</span>
      </div>
        <div className={styles.body}>
      {children}
      <span className={styles.add}>+</span>
          </div>
    </div>
  )
}
