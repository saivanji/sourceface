import React from "react"
import { Input } from "components/form/native"
import { Label } from "components/form/generic"
import { Button, Stack, Link } from "components/kit"
import { Layout, Box } from "components/common/auth"

export default () => {
  return (
    <Layout>
      <Box
        title="Create your account"
        description="Enter your credentials into the form below"
      >
        <Stack stretchItem spacing={4}>
          <Label title="Username">
            <Input
              placeholder="johndoe"
              type="text"
              size="loose"
              shouldFitContainer
            />
          </Label>
          <Label title="Email">
            <Input
              placeholder="example@domain.com"
              type="text"
              size="loose"
              shouldFitContainer
            />
          </Label>
          <Label
            title="Password"
            helperMessage="At least 6 aphanumerical characters."
          >
            <Input
              placeholder="********"
              type="password"
              size="loose"
              shouldFitContainer
            />
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
