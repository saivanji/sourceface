import React, { useState } from "react"
import Input from "react-input-autosize"
import BottomArrow from "assets/chev-b.svg"
import TopArrow from "assets/chev-t.svg"
import Delete from "assets/delete.svg"
import styles from "./card.scss"

export default function Card({
  children,
  cut,
  add = false,
  name,
  onRename,
  onRemove,
}) {
  const [isOpened, setOpened] = useState(false)

  return (
    <div className={styles.root}>
      <div className={styles.primary}>
        <div className={styles.head}>
          <Input
            value={name}
            inputClassName={styles.name}
            placeholder="Unnamed"
            onChange={(e) => onRename(e.target.value)}
          />
          <Delete onClick={onRemove} className={styles.deleteIcon} />
        </div>
        <div className={styles.body}>
          {children}
          {add && <span className={styles.add}>+</span>}
        </div>
      </div>
      {cut && !isOpened ? (
        <div className={styles.show} onClick={() => setOpened(true)}>
          ---
          <BottomArrow className={styles.bottomIcon} />
        </div>
      ) : (
        isOpened && (
          <div className={styles.expanded}>
            {cut}{" "}
            <TopArrow
              className={styles.topIcon}
              onClick={() => setOpened(false)}
            />
          </div>
        )
      )}
    </div>
  )
}
