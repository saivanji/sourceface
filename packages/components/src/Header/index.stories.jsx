import React from "react"
import { withKnobs, select } from "@storybook/addon-knobs"
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

export default { title: "Header", decorators: [withKnobs, withA11y] }

const Regular = ({ appearance }) => (
  <Header
    appearance={appearance}
    size={select("Size", ["compact", "normal", "loose"], "normal")}
    style={{ display: "flex", alignItems: "center" }}
  >
    <Breadcrumbs items={items} />
    <div style={{ marginLeft: "auto" }}>
      <Avatar>A</Avatar>
    </div>
  </Header>
)

export const Primary = () => <Regular appearance="primary" />
export const Secondary = () => <Regular appearance="secondary" />
