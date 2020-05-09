import React from "react"
import { withKnobs, boolean, select } from "@storybook/addon-knobs"
import { withA11y } from "@storybook/addon-a11y"
import Checkbox from "./index"

export default { title: "Checkbox", decorators: [withKnobs, withA11y] }

const makeProps = () => ({
  size: select("Size", ["compact", "normal", "loose"], "normal"),
  isDisabled: boolean("Disabled"),
})

export const withLabel = () => (
  <Checkbox {...makeProps()} label="Are you sure?" />
)
export const withoutLabel = () => <Checkbox {...makeProps()} />
