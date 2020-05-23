import React from "react"
import { withKnobs, select } from "@storybook/addon-knobs"
import { withA11y } from "@storybook/addon-a11y"
import Avatar from "./index"

export default { title: "Avatar", decorators: [withKnobs, withA11y] }

export const Regular = () => (
  <Avatar
    value={select("Value", ["A", "B", "C"], "A")}
    size={select("Size", ["compact", "normal", "loose"], "normal")}
  />
)
