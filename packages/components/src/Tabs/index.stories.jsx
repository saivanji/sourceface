import React from "react"
import { withA11y } from "@storybook/addon-a11y"
import Tabs, { Tab } from "./index"

export default { title: "Tabs", decorators: [withA11y] }

export const regular = () => (
  <Tabs>
    <Tab isSelected>Users</Tab>
    <Tab>Invitations</Tab>
  </Tabs>
)

export const iconBefore = () => (
  <Tabs>
    <Tab isSelected iconBefore="🔥">
      Users
    </Tab>
    <Tab>Invitations</Tab>
  </Tabs>
)

export const iconAfter = () => (
  <Tabs>
    <Tab isSelected>Users</Tab>
    <Tab iconAfter="🍔">Invitations</Tab>
  </Tabs>
)
