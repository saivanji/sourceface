import React from "react"
import { withA11y } from "@storybook/addon-a11y"
import Sidebar from "./index"

export default { title: "Sidebar", decorators: [withA11y] }

export const Regular = () => (
  <Sidebar>
    <Sidebar.Pane>
      <Sidebar.PaneLogo />
      <Sidebar.PaneLink href="#">🔥</Sidebar.PaneLink>
    </Sidebar.Pane>
    <Sidebar.Menu>
      <Sidebar.MenuTitle>Settings</Sidebar.MenuTitle>
      <Sidebar.Group>
        <Sidebar.GroupLink href="#" iconBefore="🔥">
          Security
        </Sidebar.GroupLink>
        <Sidebar.GroupLink href="#" iconBefore="🔥" isActive>
          Users management
        </Sidebar.GroupLink>
        <Sidebar.GroupLink href="#" iconBefore="🔥">
          Access management
        </Sidebar.GroupLink>
      </Sidebar.Group>
    </Sidebar.Menu>
  </Sidebar>
)
