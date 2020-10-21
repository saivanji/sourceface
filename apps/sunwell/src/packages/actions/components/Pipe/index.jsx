import React from "react"
import styles from "./index.scss"
import Creation from "../Creation"

export default ({ children }) => {
  return (
    <div>
      {React.Children.map(children, (item, i) => {
        return (
          <div className={styles.action} key={i}>
            {item}
          </div>
        )
      })}
      <Creation className={styles.add} />
    </div>
  )
}
