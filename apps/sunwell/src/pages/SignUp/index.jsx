import React from "react"
import Button from "@sourceface/components/button"
import Spinner from "@sourceface/components/spinner"
import Input from "@sourceface/components/input"
import Label from "@sourceface/components/label"
import { Layout, Strength } from "components/auth"
import ErrorIcon from "assets/error.svg"
import CheckIcon from "assets/check.svg"
import styles from "./index.css"

export default () => {
  return (
    <Layout
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
          iconAfter={<CheckIcon />}
        />
      </Label>
      <Label className={styles.label} title="Password">
        <Input
          placeholder="********"
          type="password"
          size="loose"
          shouldFitContainer
          iconAfter={<Spinner size="compact" />}
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
    </Layout>
  )
}

const Terms = () => (
  <div className={styles.terms}>
    By signing up I agree with
    <Button appearance="link" className={styles.termsLink}>
      Terms and Conditions
    </Button>
    of the application and service it provides
  </div>
)
