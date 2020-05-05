import React from "react"
import { Button, Spinner, Input, Label } from "@sourceface/components"
import { Layout, Box } from "components/auth"
import ErrorIcon from "assets/error.svg"
import Strength from "./Strength"
import styles from "./index.css"

export default () => {
  return (
    <Layout>
      <Box
        title="Welcome aboard"
        description="Enter your credentials into the form below in order to create your account"
      >
        <Label className={styles.label} title="Username">
          <Input
            placeholder="johndoe"
            type="text"
            size="loose"
            shouldFitContainer
            iconAfter={<ErrorIcon />}
          />
        </Label>
        <Label className={styles.label} title="Email">
          <Input
            placeholder="example@domain.com"
            type="text"
            size="loose"
            shouldFitContainer
            iconAfter="done"
          />
        </Label>
        <Label className={styles.label} title="Password">
          <Input
            placeholder="********"
            type="password"
            size="loose"
            shouldFitContainer
            iconAfter={<Spinner />}
          />
          <Strength />
        </Label>
        <Label title="Confirmation">
          <Input
            placeholder="********"
            type="password"
            size="loose"
            shouldFitContainer
          />
        </Label>
        <Button
          className={styles.submit}
          type="submit"
          size="loose"
          shouldFitContainer
        >
          Get started
        </Button>
        <Terms />
      </Box>
    </Layout>
  )
}

const Terms = () => (
  <div className="mt-4 text-center text-gray-tint-10 px-4">
    By signing up I agree with
    <Button appearance="link" className="text-gray-shade-80 mx-1">
      Terms and Conditions
    </Button>
    of the application and service it provides
  </div>
)
