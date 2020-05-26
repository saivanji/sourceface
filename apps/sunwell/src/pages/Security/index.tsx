import React from "react"
import { Button, Card, Input, Label } from "@sourceface/components"
import { Layout } from "components/common"
import styles from "./index.scss"

// separation of sections will be done with cards in desktop and with labeled panes(similar to native ios and android) on mobile
export default () => {
  return (
    <Layout>
      <Card>
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
      </Card>
    </Layout>
  )
}
