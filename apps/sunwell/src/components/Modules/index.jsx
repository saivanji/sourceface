import React, { useState, useCallback } from "react"
import cx from "classnames"
import { useDrag } from "packages/dnd"
import styles from "./index.scss"

export default function Modules({ stock }) {
  return stock.map(module => (
    <div key={module.type} className={styles.item}>
      <Card module={module} />
    </div>
  ))
}

function Card({ module }) {
  const [preview, setPreview] = useState(null)

  // TODO: investigate the use of "useCallback" hook here. now it's used for the referential equality to satisfy dnd lib
  const handleStart = useCallback(
    () => ({
      id: "outer_temp",
      unit: module.size,
      moduleType: module.type,
    }),
    []
  )

  const handleMove = useCallback((transfer, { clientX, clientY }) => {
    setPreview({
      x: clientX - 30,
      y: clientY - 14,
    })
  }, [])

  const handleEnd = useCallback(() => setPreview(null), [])

  const dragRef = useDrag("outer", {
    onStart: handleStart,
    onMove: handleMove,
    onEnd: handleEnd,
  })

  return (
    <>
      <div ref={dragRef} className={cx(styles.card, preview && styles.dimmed)}>
        {module.type}
      </div>
      {preview && (
        <div
          style={{
            transform: `translate(${preview.x}px, ${preview.y}px)`,
          }}
          className={cx(styles.card, styles.preview)}
        >
          {module.type}
        </div>
      )}
    </>
  )
}
