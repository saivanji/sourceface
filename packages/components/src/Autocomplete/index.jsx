import React, { useState } from "react"
import styles from "./index.scss"

export default function Autocomplete({ children }) {
  const [value, setValue] = useState("");

  return (
    <div className={styles.root}>
      <input
        autoFocus
        value={value}
        onChange={e => setValue(e.target.value)}
        className={styles.input}
        type="text"
        placeholder="Search for ..."
      />
      <div className={styles.items}>{typeof children === 'function' ? children(value) : children}</div>
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
