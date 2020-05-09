import React from "react"
import { withA11y } from "@storybook/addon-a11y"
import Spinner from "./index"

export default { title: "Spinner", decorators: [withA11y] }

export const Light = () => <Spinner appearance="light"></Spinner>
export const Dark = () => <Spinner appearance="dark"></Spinner>
