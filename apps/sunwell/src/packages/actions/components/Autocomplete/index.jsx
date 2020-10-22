import React, { useState, useContext, createContext } from "react"
import styles from "./index.scss"

const context = createContext()

// TODO: move to kit
// TODO: implement helper which will be used in Dropdown and Autocomplete. Inherit code from autocomplete(including side
// positioning css)

export default function Autocomplete({ children }) {
  const [isOpened, setOpened] = useState(false)
  const toggle = () => setOpened(!isOpened)

  return (
    <context.Provider value={{ isOpened, toggle }}>
      <div className={styles.root}>{children}</div>
    </context.Provider>
  )
}

Autocomplete.Trigger = function AutocompleteTrigger({ children, ...props }) {
  const { toggle } = useContext(context)

  return (
    <div {...props} onClick={toggle}>
      {children}
    </div>
  )
}

Autocomplete.Body = function AutocompleteBody() {
  const { isOpened } = useContext(context)

  return (
    isOpened && (
      <div className={styles.body}>
        <input
          className={styles.input}
          type="text"
          placeholder="Search for ..."
        />
        <div className={styles.items}>
          <span className={styles.item}>Value 1</span>
          <span className={styles.item}>Value 2</span>
          <span className={styles.item}>Value 3</span>
          <span className={styles.item}>Value 4</span>
          <span className={styles.item}>Value 5</span>
        </div>
      </div>
    )
  )
}
