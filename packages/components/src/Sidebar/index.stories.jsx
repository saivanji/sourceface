import React from "react"
import { withA11y } from "@storybook/addon-a11y"
import Sidebar from "./index"

export default { title: "Sidebar", decorators: [withA11y] }

export const Regular = () => (
  <Sidebar>
    <Sidebar.Title>Settings</Sidebar.Title>
    <Sidebar.Group>
      <Sidebar.GroupLink href="#">Security</Sidebar.GroupLink>
      <Sidebar.GroupLink href="#" isSelected>
        Users management
      </Sidebar.GroupLink>
      <Sidebar.GroupLink href="#">Access management</Sidebar.GroupLink>
    </Sidebar.Group>
  </Sidebar>
)
