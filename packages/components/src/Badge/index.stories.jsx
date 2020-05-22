import React from "react"
import { withKnobs, text, select } from "@storybook/addon-knobs"
import { withA11y } from "@storybook/addon-a11y"
import Badge from "./index"

const makeProps = () => ({
  shape: select("Shape", ["rounded", "squared"], "rounded"),
  children: text("Value", "25"),
})

export default { title: "Badge", decorators: [withKnobs, withA11y] }

export const Primary = () => <Badge {...makeProps()} appearance="primary" />
export const Secondary = () => <Badge {...makeProps()} appearance="secondary" />
