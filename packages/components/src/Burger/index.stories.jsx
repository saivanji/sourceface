import React from "react"
import { withKnobs, select } from "@storybook/addon-knobs"
import { withA11y } from "@storybook/addon-a11y"
import Burger from "./index"

export default { title: "Burger", decorators: [withKnobs, withA11y] }

const makeProps = () => ({
  size: select("Size", ["compact", "normal", "loose"], "normal"),
})

export const Light = () => <Burger {...makeProps()} appearance="light" />

export const Dark = () => <Burger {...makeProps()} appearance="dark" />
