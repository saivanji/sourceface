import React from "react"
import { withKnobs } from "@storybook/addon-knobs"
import { withA11y } from "@storybook/addon-a11y"
import List from "./index"

export default { title: "List", decorators: [withKnobs, withA11y] }

export const Regular = () => (
  <List>
    <List.Item>Lorem tempora odio odio eveniet</List.Item>
    <List.Item>Elit sint velit corrupti officiis.</List.Item>
    <List.Item>Elit reprehenderit minus exercitationem omnis</List.Item>
    <List.Item>
      Adipisicing reprehenderit accusamus voluptatem incidunt.
    </List.Item>
    <List.Item>Dolor earum itaque aspernatur unde.</List.Item>
  </List>
)
