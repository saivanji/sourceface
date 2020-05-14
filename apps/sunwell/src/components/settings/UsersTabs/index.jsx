import React from "react"
import Badge from "@sourceface/components/badge"
import Tabs, { Tab, TabsHeader, TabsBody } from "@sourceface/components/tabs"

export default function UsersTabs({ children, selected, invitationsCount }) {
  return (
    <Tabs>
      <TabsHeader>
        <Tab isSelected={selected === "users"}>Users</Tab>
        <Tab
          isSelected={selected === "invitations"}
          iconAfter={<Badge value={invitationsCount} />}
        >
          Invitations
        </Tab>
      </TabsHeader>
      <TabsBody>{children}</TabsBody>
    </Tabs>
  )
}
