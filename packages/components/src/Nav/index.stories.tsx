import React from "react"
import { withA11y } from "@storybook/addon-a11y"
import Nav from "./index"

export default { title: "Nav", decorators: [withA11y] }

export const Regular = () => (
  <Nav>
    <Nav.Logo />
    <Nav.Link href="#">🔥</Nav.Link>
    <Nav.Link href="#">🔥</Nav.Link>
    <Nav.Link href="#">🔥</Nav.Link>
  </Nav>
)
