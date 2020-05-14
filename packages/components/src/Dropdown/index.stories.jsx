import React from "react"
import { withKnobs, select } from "@storybook/addon-knobs"
import { withA11y } from "@storybook/addon-a11y"
import Button from "../Button"
import Dropdown from "./index"

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
      <Dropdown.Trigger>
        <Button>Click me</Button>
      </Dropdown.Trigger>
      <Dropdown.Menu {...makeMenuProps()}>
        <Dropdown.Item>Consectetur officiis.</Dropdown.Item>
        <Dropdown.Item>Consectetur harum</Dropdown.Item>
        <Dropdown.Item>Amet asperiores.</Dropdown.Item>
        <Dropdown.Item>Sit ipsam.</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  </div>
)

const rootStyle = {
  padding: "10rem",
}
