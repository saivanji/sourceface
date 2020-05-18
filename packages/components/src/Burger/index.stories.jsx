import React from "react"
import { withA11y } from "@storybook/addon-a11y"
import Burger from "./index"

export default { title: "Burger", decorators: [withA11y] }

export const Light = () => <Burger appearance="light" />

export const Dark = () => <Burger appearance="dark" />
