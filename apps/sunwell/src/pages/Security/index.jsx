import React from "react"
import Button from "@sourceface/components/button"
import Input from "@sourceface/components/input"
import Label from "@sourceface/components/label"
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
