import React, { useState } from "react"
import cx from "classnames"
import styles from "./index.scss"
import Branch from "assets/branch.svg"

export default function ({ children }) {
  const [isOpened, setOpened] = useState(false)

  return (
    <div>
      <span
        onClick={() => setOpened((value) => !value)}
        className={cx(styles.link, isOpened && styles.opened)}
      >
        <Branch className={styles.actionsIcon} />3 actions assigned
      </span>
      {isOpened && <div className={styles.content}>{children}</div>}
    </div>
  )
}
