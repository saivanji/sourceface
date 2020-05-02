import React from "react"
import {
  Button,
  Stack,
  Link,
  Spinner,
  Input,
  Label,
} from "@sourceface/components"
import { Layout, Box } from "components/auth"
import Strength from "./Strength"

export default () => {
  return (
    <Layout>
      <Box
        title="Welcome aboard"
        description="Enter your credentials into the form below in order to create your account"
      >
        <Stack stretchItem spacing={4}>
          <Label title="Username">
            <Input
              placeholder="johndoe"
              type="text"
              size="loose"
              shouldFitContainer
              iconAfter="error"
            />
          </Label>
          <Label title="Email">
            <Input
              placeholder="example@domain.com"
              type="text"
              size="loose"
              shouldFitContainer
              iconAfter="done"
            />
          </Label>
          <Label title="Password">
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
        </Stack>
        <Button className="mt-5" type="submit" size="loose" shouldFitContainer>
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
    <Link className="text-gray-shade-80 mx-1">Terms and Conditions</Link>
    of the application and service it provides
  </div>
)
