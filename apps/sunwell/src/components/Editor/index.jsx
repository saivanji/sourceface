import React from "react"
import Configuration from "../Configuration"
import Stock from "../Stock"
import Modules from "../Modules"
import { useEditor } from "packages/factory"
import styles from "./index.scss"

// near the orders page will be a button opening a modal to edit current page properties(url, etc?)
// page title is editable?
// page creation button could be near page title, also page title is a select which has all pages inside
export default function Editor() {
  const { selected, edit } = useEditor()

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <span className={styles.title}>Orders page</span>
        <div>mobile | tablet | desktop</div>
        <div>
          <button onClick={() => edit(false)}>Close</button>
        </div>
      </div>
      <div className={styles.right}>
        {selected ? <Configuration /> : <Stock />}
      </div>
      <div className={styles.body}>
        <div className={styles.content}>
          <Modules />
        </div>
      </div>
    </div>
  )
}
