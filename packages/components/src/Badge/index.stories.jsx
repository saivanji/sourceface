import React from "react"
import { withKnobs, text, select } from "@storybook/addon-knobs"
import { withA11y } from "@storybook/addon-a11y"
import Badge from "./index"

const makeProps = () => ({
  shape: select("Shape", ["rounded", "squared"], "rounded"),
})

export default { title: "Badge", decorators: [withKnobs, withA11y] }

export const Light = () => (
  <Badge {...makeProps()} appearance="light" value={text("Value", "25")} />
)
export const Dark = () => (
  <Badge {...makeProps()} appearance="dark" value={text("Value", "25")} />
)
