import React from "react"
import { withA11y } from "@storybook/addon-a11y"
import Avatar from "../Avatar"
import Breadcrumbs from "../Breadcrumbs"
import Header from "./index"

const items = [
  {
    name: "Home",
    link: "/",
  },
  {
    name: "Settings",
    link: "/settings",
  },
  {
    name: "Users",
    link: "/settings/users",
  },
]

export default { title: "Header", decorators: [withA11y] }

export const Regular = () => (
  <Header>
    <Breadcrumbs items={items} />
    <div style={{ marginLeft: "auto" }}>
      <Avatar value="A" />
    </div>
  </Header>
)
