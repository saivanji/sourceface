import React from "react"
import { withKnobs, select, text } from "@storybook/addon-knobs"
import { withA11y } from "@storybook/addon-a11y"
import Input from "./index"

export default { title: "Input", decorators: [withKnobs, withA11y] }

const makeProps = () => ({
  size: select("Size", ["compact", "normal", "loose"], "normal"),
  placeholder: text("Placeholder", "Enter something"),
})

export const Regular = () => <Input {...makeProps()} />
export const Error = () => (
  <Input {...makeProps()} error="This field is required" />
)
