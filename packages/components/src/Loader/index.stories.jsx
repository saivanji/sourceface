import React from "react"
import { withA11y } from "@storybook/addon-a11y"
import Loading from "./index"

export default { title: "Loading", decorators: [withA11y] }

export const Regular = () => (
  <Loading isLoading>
    Lorem consequatur vitae eos aspernatur vero Ex et officiis velit molestias
    molestiae. Quas dicta voluptatem numquam repellendus id eius veritatis aut
    Quibusdam possimus sed est quidem inventore. Quidem dolores magni fuga
    consequuntur temporibus Quam vitae perferendis modi reiciendis facere.
    Quidem recusandae asperiores quis laborum nulla, voluptatum Aperiam
    exercitationem perferendis dicta fugit suscipit maiores aperiam? Quas quo
    aspernatur rem cumque dolore dolorum soluta? Minus tempora rem ad excepturi
    assumenda, praesentium? Maiores dolorem voluptatibus tempora in quia Beatae
    cumque ab cum autem a Nihil similique fuga accusantium atque voluptatem!
    Nemo rerum laudantium.
  </Loading>
)
