import React from "react"
import styles from "./index.scss"

export default function Breadcrumbs({ path }) {
  return (
    <div className={styles.root}>
      {path.map((item, i) => (
        <React.Fragment key={i}>
          {i !== 0 && "/"}
          <a className={styles.link} key={i} href="#">
            {item.title}
          </a>
        </React.Fragment>
      ))}
    </div>
  )
}
