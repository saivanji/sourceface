import React from "react"
import { withA11y } from "@storybook/addon-a11y"
import Tabs, { Tab, TabsHead, TabsBody } from "./index"

const body = (
  <TabsBody>
    Ipsum eius nobis magnam sequi dolorem, omnis veniam Placeat vero nihil
    quibusdam esse quas! Molestias laudantium eos similique voluptatibus
    reiciendis similique Ducimus odit reprehenderit modi praesentium laudantium?
    Ullam optio omnis
  </TabsBody>
)

export default { title: "Tabs", decorators: [withA11y] }

export const Regular = () => (
  <Tabs>
    <TabsHead>
      <Tab isSelected>Users</Tab>
      <Tab>Invitations</Tab>
    </TabsHead>
    {body}
  </Tabs>
)

export const IconBefore = () => (
  <Tabs>
    <TabsHead>
      <Tab isSelected iconBefore="🔥">
        Users
      </Tab>
      <Tab>Invitations</Tab>
    </TabsHead>
    {body}
  </Tabs>
)

export const IconAfter = () => (
  <Tabs>
    <TabsHead>
      <Tab isSelected>Users</Tab>
      <Tab iconAfter="🍔">Invitations</Tab>
    </TabsHead>
    {body}
  </Tabs>
)
