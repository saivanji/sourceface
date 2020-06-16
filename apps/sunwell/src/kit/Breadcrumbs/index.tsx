import React from "react"
import styles from "./index.scss"

export default function Breadcrumbs({ path }: Props) {
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

interface Props {
  path: Link[]
}

interface Link {
  title: string
  link: string
}
