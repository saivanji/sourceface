import React from "react"
import { withKnobs, select } from "@storybook/addon-knobs"
import { withA11y } from "@storybook/addon-a11y"
import List, { Item } from "./index"

export default { title: "List", decorators: [withKnobs, withA11y] }

export const Regular = () => (
  <List>
    <Item>Lorem tempora odio odio eveniet</Item>
    <Item>Elit sint velit corrupti officiis.</Item>
    <Item>Elit reprehenderit minus exercitationem omnis</Item>
    <Item>Adipisicing reprehenderit accusamus voluptatem incidunt.</Item>
    <Item>Dolor earum itaque aspernatur unde.</Item>
  </List>
)
