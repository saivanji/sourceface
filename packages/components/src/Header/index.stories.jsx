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
  >
    <Breadcrumbs items={items} />
    <div style={{ marginLeft: "auto" }}>
      <Avatar value="A" />
    </div>
  </Header>
)

export const Light = () => <Regular appearance="light" />
export const Dark = () => <Regular appearance="dark" />
