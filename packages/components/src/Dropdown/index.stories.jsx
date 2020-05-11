import React from "react"
import { withKnobs, text, select } from "@storybook/addon-knobs"
import { withA11y } from "@storybook/addon-a11y"
import Button from "../Button"
import Dropdown, { DropdownButton, DropdownMenu, DropdownItem } from "./index"

const makeMenuProps = () => ({
  position: select(
    "Position",
    ["bottomLeft", "bottomRight", "topLeft", "topRight"],
    "bottomRight"
  ),
})

export default { title: "Dropdown", decorators: [withKnobs, withA11y] }

export const Regular = () => (
  <div style={rootStyle}>
    <Dropdown>
      <DropdownButton>
        <Button>Click me</Button>
      </DropdownButton>
      <DropdownMenu {...makeMenuProps()}>
        <DropdownItem>Consectetur officiis.</DropdownItem>
        <DropdownItem>Consectetur harum</DropdownItem>
        <DropdownItem>Amet asperiores.</DropdownItem>
        <DropdownItem>Sit ipsam.</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
)

const rootStyle = {
  padding: "10rem",
}
