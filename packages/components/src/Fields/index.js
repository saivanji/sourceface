import React from "react"
import cx from "classnames"
import styles from "./index.css"

export default function Fields({
  children,
  className,
  direction = "vertical",
}) {
  return (
    <div className={cx(styles.root, styles[direction], className)}>
      {React.Children.toArray(children).map((item, i) => (
        <div key={i} className={styles.item}>
          {item}
        </div>
      ))}
    </div>
  )
}
