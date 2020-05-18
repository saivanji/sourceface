import React from "react"
import Spinner from "../Spinner"
import styles from "./index.scss"

export default function Loader({ isLoading, children }) {
  return (
    <div className={styles.root}>
      <div className={isLoading && styles.loading}>{children}</div>
      {isLoading && (
        <div className={styles.spinner}>
          <Spinner />
        </div>
      )}
    </div>
  )
}
