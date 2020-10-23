import React from "react"
import styles from "./index.scss"

// TODO: move to kit
export default function Autocomplete({ children }) {
  return (
    <div className={styles.root}>
      <input
        autoFocus
        className={styles.input}
        type="text"
        placeholder="Search for ..."
      />
      <div className={styles.items}>{children}</div>
    </div>
  )
}

Autocomplete.Item = function AutocompleteItem({ children, onClick }) {
  return (
    <span className={styles.item} onClick={onClick}>
      {children}
    </span>
  )
}
