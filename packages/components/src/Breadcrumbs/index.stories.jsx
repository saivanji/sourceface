import React from "react"
import { withA11y } from "@storybook/addon-a11y"
import Breadcrumbs from "./index"

export default { title: "Breadcrumbs", decorators: [withA11y] }

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
    name: "Account",
    link: "/settings/account",
  },
]

export const Regular = () => <Breadcrumbs items={items} />
