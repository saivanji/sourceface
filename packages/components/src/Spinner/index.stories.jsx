import React from "react"
import { withA11y } from "@storybook/addon-a11y"
import { withKnobs, select } from "@storybook/addon-knobs"
import Spinner from "./index"

const makeProps = () => ({
  size: select("Size", ["compact", "normal", "loose"], "normal"),
})

export default { title: "Spinner", decorators: [withKnobs, withA11y] }

export const Primary = () => (
  <Spinner {...makeProps()} appearance="primary"></Spinner>
)
export const Secondary = () => (
  <Spinner {...makeProps()} appearance="secondary"></Spinner>
)
