import React from "react"
import { withA11y } from "@storybook/addon-a11y"
import Tabs from "./index"

const body = (
  <Tabs.Body>
    Ipsum eius nobis magnam sequi dolorem, omnis veniam Placeat vero nihil
    quibusdam esse quas! Molestias laudantium eos similique voluptatibus
    reiciendis similique Ducimus odit reprehenderit modi praesentium laudantium?
    Ullam optio omnis
  </Tabs.Body>
)

export default { title: "Tabs", decorators: [withA11y] }

export const Regular = () => (
  <Tabs>
    <Tabs.Header>
      <Tabs.Tab isSelected>Users</Tabs.Tab>
      <Tabs.Tab>Invitations</Tabs.Tab>
    </Tabs.Header>
    {body}
  </Tabs>
)

export const IconBefore = () => (
  <Tabs>
    <Tabs.Header>
      <Tabs.Tab isSelected iconBefore="🔥">
        Users
      </Tabs.Tab>
      <Tabs.Tab>Invitations</Tabs.Tab>
    </Tabs.Header>
    {body}
  </Tabs>
)

export const IconAfter = () => (
  <Tabs>
    <Tabs.Header>
      <Tabs.Tab isSelected>Users</Tabs.Tab>
      <Tabs.Tab iconAfter="🍔">Invitations</Tabs.Tab>
    </Tabs.Header>
    {body}
  </Tabs>
)
