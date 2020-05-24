import React from "react"
import { Button, Checkbox, Input, Label } from "@sourceface/components"
import { Layout } from "components/auth"
import styles from "./index.scss"

export default () => {
  return (
    <Layout
      title="Sign In to your account"
      description="Enter your credentials into the form below"
    >
      <Label className={styles.label} title="Email">
        <Input placeholder="example@domain.com" type="text" size="loose" />
      </Label>
      <Label className={styles.label} title="Password">
        <Input placeholder="********" type="password" size="loose" />
      </Label>
      <div className={styles.bottomLine}>
        <Checkbox label="Stay signed in" />
        <Button appearance="link">Forgot password?</Button>
      </div>
      <Button type="submit" size="loose" shouldFitContainer>
        Continue
      </Button>
    </Layout>
  )
}
