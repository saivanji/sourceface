import React from "react"
import { Breadcrumbs } from "@sourceface/components"
import styles from "./index.scss"

// dashboard frame component containing Header component and so on
export default function Frame({ children, path, actions }) {
  return (
    <div className={styles.root}>
      <div className={styles.pane}>
        <Breadcrumbs path={path} />
        {actions && <div className={styles.actions}>{actions}</div>}
      </div>
      {children}
    </div>
  )
}
