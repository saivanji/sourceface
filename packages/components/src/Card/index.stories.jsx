import React from "react"
import { withKnobs, select, text } from "@storybook/addon-knobs"
import { withA11y } from "@storybook/addon-a11y"
import Card from "./index"

export default { title: "Card", decorators: [withKnobs, withA11y] }

export const Regular = () => (
  <Card size={select("Size", ["compact", "normal", "loose"], "normal")}>
    Adipisicing adipisci quidem sapiente voluptate provident deleniti quae?
    Ullam molestias tempora sapiente repellat similique. Incidunt vel sed quia
    consequatur magnam Provident enim delectus esse ipsum sit? Assumenda optio
    magni quidem
  </Card>
)
