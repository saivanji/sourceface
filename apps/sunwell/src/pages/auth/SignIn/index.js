import React from "react"
import { Input, Checkbox } from "components/form/native"
import { Label } from "components/form/generic"
import { Button, Link, Stack } from "components/kit"

export default () => {
  return (
    <div className="min-h-screen flex items-center justify-center relative">
      <div className="flex flex-col max-w-lg w-full mx-4 mt-4 mb-16">
        <div className="bg-white rounded p-8 shadow-md">
          <span className="block mb-1 text-2xl font-semibold text-gray-shade-110">
            Sign In to your account
          </span>
          <span className="block mb-6 text-gray-shade-50">
            Enter your credentials into the form below
          </span>
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
          <Button
            className="mt-5"
            type="submit"
            size="loose"
            shouldFitContainer
          >
            Continue
          </Button>
        </div>
        {/* <Separator /> */}
        <span className="mt-auto absolute w-full bottom-0 left-0 text-xs text-center font-bold mb-4">
          Crafted with <span>❤</span>️ by @aiven715
        </span>
      </div>
    </div>
  )
}

// const Separator = () => (
//   <div className="flex items-center my-10">
//     <div className="h-px w-full bg-gray-tint-20"></div>
//     <span className="mx-4 text-gray-shade-100">or</span>
//     <div className="h-px w-full bg-gray-tint-20"></div>
//   </div>
// )
