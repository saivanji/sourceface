import React from "react"
import { Input, Checkbox } from "components/form/native"
import { Label } from "components/form/generic"
import { Button, Link, Stack } from "components/kit"
import { Layout, Box } from "components/common/auth"

export default () => {
  return (
    <Layout>
      <Box
        title="Sign In to your account"
        description="Enter your credentials into the form below"
      >
        <Stack stretchItem spacing={4}>
          <Label title="Email">
            <Input
              placeholder="example@domain.com"
              type="text"
              size="loose"
              shouldFitContainer
            />
          </Label>
          <Label title="Password" right={<Link>Forgot password?</Link>}>
            <Input
              placeholder="********"
              type="password"
              size="loose"
              shouldFitContainer
            />
          </Label>
          <Stack direction="row" justifyContent="between">
            <Checkbox label="Stay signed in" />
            <Link>Forgot password?</Link>
          </Stack>
        </Stack>
        <Button className="mt-5" type="submit" size="loose" shouldFitContainer>
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
