import React from "react"
import * as styles from "./index.styles"

export default function Breadcrumbs({ items, renderLink, ...props }) {
  const path = items.slice(0, -1)
  const current = items.slice(-1)[0]

  return (
    <div {...props} css={styles.root}>
      <span css={styles.path}>
        {path.map((item, i) => (
          <React.Fragment key={i}>
            {i !== 0 && " › "}
            <a css={styles.link} key={i} href="#">
              {item.name}
            </a>
          </React.Fragment>
        ))}
      </span>
      <span css={styles.current}>{current.name}</span>
    </div>
  )
}
