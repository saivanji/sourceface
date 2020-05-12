import React from "react"
import { withKnobs, select, text } from "@storybook/addon-knobs"
import { withA11y } from "@storybook/addon-a11y"
import Select from "./index"

export default { title: "Select", decorators: [withKnobs, withA11y] }

const makeProps = () => ({
  size: select("Size", ["compact", "normal", "loose"], "normal"),
  placeholder: text("Placeholder", "Choose a city"),
  options: [
    {
      label: "New York",
      value: "new_york",
    },
    {
      label: "Los Angeles",
      value: "los_angeles",
    },
    {
      label: "Berlin",
      value: "berlin",
    },
    {
      label: "Paris",
      value: "paris",
    },
  ],
})

export const Regular = () => <Select {...makeProps()} />
export const Error = () => (
  <Select {...makeProps()} error="This field is required" />
)
