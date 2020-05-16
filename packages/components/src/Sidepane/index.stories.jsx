import React from "react"
import { withA11y } from "@storybook/addon-a11y"
import Sidepane from "./index"

export default { title: "Sidepane", decorators: [withA11y] }

export const Regular = () => (
  <Sidepane>
    <Sidepane.Logo />
    <Sidepane.Link href="#">🔥</Sidepane.Link>
    <Sidepane.Link href="#">🔥</Sidepane.Link>
    <Sidepane.Link href="#">🔥</Sidepane.Link>
  </Sidepane>
)
