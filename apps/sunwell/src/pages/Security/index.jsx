import React from "react"
import { Button, Input, Label } from "@sourceface/components"
import styles from "./index.css"

export default () => {
  return (
    <>
      <Label className={styles.label} title="Old password">
        <Input placeholder="********" type="password" />
      </Label>
      <Label className={styles.label} title="New password">
        <Input placeholder="********" type="password" />
      </Label>
      <Label className={styles.label} title="New password confirmation">
        <Input placeholder="********" type="password" />
      </Label>
      <Button type="submit">Update password</Button>
    </>
  )
}
