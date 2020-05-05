import React from "react"
import { Button, Input, Checkbox, Label } from "@sourceface/components"
import { Layout, Box } from "components/auth"
import styles from "./index.css"

export default () => {
  return (
    <Layout>
      <Box
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
      </Box>
      {/* <Separator /> */}
    </Layout>
  )
}

// const Separator = () => (
//   <div className="flex items-center my-10">
//     <div className="h-px w-full bg-gray-tint-20"></div>
//     <span className="mx-4 text-gray-shade-100">or</span>
//     <div className="h-px w-full bg-gray-tint-20"></div>
//   </div>
// )
