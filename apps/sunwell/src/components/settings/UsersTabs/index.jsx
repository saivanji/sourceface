import React from "react"
import Badge from "@sourceface/components/badge"
import Tabs from "@sourceface/components/tabs"

export default function UsersTabs({ children, selected, invitationsCount }) {
  return (
    <Tabs>
      <Tabs.Header>
        <Tabs.Tab isSelected={selected === "users"}>Users</Tabs.Tab>
        <Tabs.Tab
          isSelected={selected === "invitations"}
          iconAfter={<Badge value={invitationsCount} />}
        >
          Invitations
        </Tabs.Tab>
      </Tabs.Header>
      <Tabs.Body>{children}</Tabs.Body>
    </Tabs>
  )
}
