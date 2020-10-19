import React, { useState } from "react"
import cx from "classnames"
import styles from "./index.scss"
import Link from "assets/link.svg"

export default function ({ children }) {
  const [isOpened, setOpened] = useState(false)

  return (
    <div>
      <span
        onClick={() => setOpened((value) => !value)}
        className={cx(styles.link, isOpened && styles.opened)}
      >
        <Link className={styles.actionsIcon} />3 actions assigned
      </span>
      {isOpened && <div className={styles.content}>{children}</div>}
    </div>
  )
}
