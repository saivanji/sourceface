import React from "react"
import Tabs, { Tab } from "./index"

export default { title: "Tabs" }

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
