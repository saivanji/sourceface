import React from "react"
import Label from "./index"
import Input from "../Input"

export default { title: "Label" }

const Child = () => <Input placeholder="Please enter the text" />

export const required = () => (
  <Label title="Username" isRequired>
    <Child />
  </Label>
)
export const notRequired = () => (
  <Label title="Username">
    <Child />
  </Label>
)
export const helperMessage = () => (
  <Label title="Username" helperMessage="Min 6 letters">
    <Child />
  </Label>
)
