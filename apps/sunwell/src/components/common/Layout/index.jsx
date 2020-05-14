import React from "react"
import styles from "./index.css"
import Header from "../Header"
import Sidebar from "../Sidebar"

// will be getting current page object from Page provided context and depending on it will render the data in breadcrumbs and sidebar
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
