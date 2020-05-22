import React from "react"
import * as styles from "./index.styles"

export default function Breadcrumbs({ items, renderLink, ...props }) {
  const path = items.slice(0, -1)
  const current = items.slice(-1)[0]

  return (
    <styles.Root {...props}>
      <styles.Path>
        {path.map((item, i) => (
          <React.Fragment key={i}>
            {i !== 0 && " › "}
            <styles.Link key={i} href="#">
              {item.name}
            </styles.Link>
          </React.Fragment>
        ))}
      </styles.Path>
      <styles.Current>{current.name}</styles.Current>
    </styles.Root>
  )
}
