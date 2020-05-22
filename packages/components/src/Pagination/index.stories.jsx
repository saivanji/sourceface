import React from "react"
import { withKnobs } from "@storybook/addon-knobs"
import { withA11y } from "@storybook/addon-a11y"
import Pagination from "./index"

export default { title: "Pagination", decorators: [withKnobs, withA11y] }

export const Regular = () => (
  <Pagination
    pageCount={9}
    pageMargin={1}
    pageSurroundings={2}
    selectedPage={0}
  />
)
