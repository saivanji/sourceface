import React from "react"
import cx from "classnames"
import { Button, Input } from "@sourceface/components"
import styles from "./index.css"

export default ({ className }) => {
  return (
    <div className={cx(styles.root, className)}>
      <Input
        className={styles.input}
        placeholder="Invite by email"
        type="text"
      />
      <Button isDisabled type="submit">
        Invite
      </Button>
    </div>
  )
}
