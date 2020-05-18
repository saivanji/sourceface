import React from "react"
import cx from "classnames"
import Button from "@sourceface/components/button"
import Input from "@sourceface/components/input"
import styles from "./index.scss"

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
