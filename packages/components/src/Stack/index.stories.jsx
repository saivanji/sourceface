import React from "react"
import Stack from "./index"
import Input from "../Input"

const Child = () => <Input placeholder="Enter username" />

export default { title: "Stack" }

export const vertical = () => (
  <Stack direction="vertical">
    <Child />
    <Child />
    <Child />
    <Child />
  </Stack>
)
export const horizontal = () => (
  <Stack direction="horizontal">
    <Child />
    <Child />
    <Child />
    <Child />
  </Stack>
)
