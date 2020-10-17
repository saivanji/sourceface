import React, { useState } from "react"
import styles from "./index.scss"
import BottomArrow from "assets/chev-b.svg"
import TopArrow from "assets/chev-t.svg"

export default function Action({ children, secondary }) {
  const [isOpened, setOpened] = useState(false)

  return (
    <div className={styles.root}>
      <div className={styles.body}>
        {children}
        <span className={styles.add}>+</span>
      </div>
      {secondary && !isOpened ? (
        <div className={styles.show} onClick={() => setOpened(true)}>
          ---
          <BottomArrow />
        </div>
      ) : (
        isOpened && (
          <div className={styles.expanded}>
            arguments <TopArrow onClick={() => setOpened(false)} />
          </div>
        )
      )}
    </div>
  )
}
