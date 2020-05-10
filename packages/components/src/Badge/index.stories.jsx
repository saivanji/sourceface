import React from "react"
import { withKnobs, text } from "@storybook/addon-knobs"
import { withA11y } from "@storybook/addon-a11y"
import Badge from "./index"

export default { title: "Badge", decorators: [withKnobs, withA11y] }

export const Regular = () => <Badge value={text("Value", "25")} />
