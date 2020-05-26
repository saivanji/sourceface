import React from "react"
import { withKnobs, text, boolean } from "@storybook/addon-knobs"
import { withA11y } from "@storybook/addon-a11y"
import Label from "./index"
import Input from "../Input"

export default { title: "Label", decorators: [withKnobs, withA11y] }

const makeProps = () => ({
  title: text("Title", "Username"),
  isOptional: boolean("Optional"),
})

const Child = () => <Input placeholder="Please enter the text" />

export const Regular = () => (
  <Label {...makeProps()} title="Username">
    <Child />
  </Label>
)
export const HelperMessage = () => (
  <Label {...makeProps()} helperMessage="Min 6 letters">
    <Child />
  </Label>
)
