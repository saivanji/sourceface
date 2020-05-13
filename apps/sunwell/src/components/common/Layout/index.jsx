import React from "react"
import styles from "./index.css"
import Header from "../Header"
import Sidebar from "../Sidebar"

export default ({ children }) => {
  return (
    <div className={styles.root}>
      <Sidebar />
      <div className={styles.main}>
        <Header />
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  )
}
