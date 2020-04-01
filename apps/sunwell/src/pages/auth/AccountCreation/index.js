import React from "react"
import { Input } from "components/form/native"
import { Label } from "components/form/generic"
import { Button, Stack, Link, Spinner } from "components/kit"
import { Layout, Box } from "components/common/auth"
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
        <div className="mt-4 flex justify-center">
          <span className="text-gray-tint-10 mr-2">
            Already have an account?
          </span>
          <Link>Sign in</Link>
        </div>
      </Box>
    </Layout>
  )
}
