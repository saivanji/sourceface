import React from "react"
import cx from "classnames"
import { useDrag } from "react-dnd"
import { SORTABLE_OUTER } from "packages/grid"
import { list } from "packages/modules"
import styles from "./index.scss"

export default function Stock() {
  return list.map((module) => (
    <div key={module.type} className={styles.item}>
      <Card module={module} />
    </div>
  ))
}

function Card({ module }) {
  const [{ isDragging }, connect] = useDrag({
    item: {
      type: SORTABLE_OUTER,
      id: "outer",
      unit: module.size,
      custom: {
        moduleType: module.type,
      },
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  return (
    <div ref={connect} className={cx(styles.card, isDragging && styles.dimmed)}>
      {module.type}
    </div>
  )
}
