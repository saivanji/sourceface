import React from "react"
import { withKnobs, text, boolean, select } from "@storybook/addon-knobs"
import { withA11y } from "@storybook/addon-a11y"
import Button from "./index"

export default { title: "Button", decorators: [withKnobs, withA11y] }

const makeProps = () => ({
  size: select("Size", ["compact", "normal", "loose"], "normal"),
  children: text("Label", "Sign Up"),
  shouldFitContainer: boolean("Fits container"),
  isDisabled: boolean("Disabled"),
  isLoading: boolean("Loading"),
})

export const Primary = () => <Button {...makeProps()} appearance="primary" />
export const Secondary = () => (
  <Button {...makeProps()} appearance="secondary" />
)
export const Tertiary = () => <Button {...makeProps()} appearance="tertiary" />
