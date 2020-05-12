import React from "react"
import { withA11y } from "@storybook/addon-a11y"
import Tabs, { Tab, TabsHeader, TabsBody } from "./index"

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
    <TabsHeader>
      <Tab isSelected>Users</Tab>
      <Tab>Invitations</Tab>
    </TabsHeader>
    {body}
  </Tabs>
)

export const IconBefore = () => (
  <Tabs>
    <TabsHeader>
      <Tab isSelected iconBefore="🔥">
        Users
      </Tab>
      <Tab>Invitations</Tab>
    </TabsHeader>
    {body}
  </Tabs>
)

export const IconAfter = () => (
  <Tabs>
    <TabsHeader>
      <Tab isSelected>Users</Tab>
      <Tab iconAfter="🍔">Invitations</Tab>
    </TabsHeader>
    {body}
  </Tabs>
)
