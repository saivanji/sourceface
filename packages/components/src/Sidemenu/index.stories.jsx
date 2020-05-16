import React from "react"
import { withA11y } from "@storybook/addon-a11y"
import Sidemenu from "./index"

export default { title: "Sidemenu", decorators: [withA11y] }

export const Regular = () => (
  <Sidemenu>
    <Sidemenu.Title>Settings</Sidemenu.Title>
    <Sidemenu.Group>
      <Sidemenu.GroupLink href="#" iconBefore="🔥">
        Security
      </Sidemenu.GroupLink>
      <Sidemenu.GroupLink href="#" iconBefore="🔥" isSelected>
        Users management
      </Sidemenu.GroupLink>
      <Sidemenu.GroupLink href="#" iconBefore="🔥">
        Access management
      </Sidemenu.GroupLink>
    </Sidemenu.Group>
  </Sidemenu>
)
