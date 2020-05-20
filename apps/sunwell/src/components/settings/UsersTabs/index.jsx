import React from "react"
import Badge from "@sourceface/components/badge"
import Tabs from "@sourceface/components/tabs"

// TODO: implement Section component which will have Card for desktop and LabeledPane for mobile and use here
export default function UsersTabs({ children, selected, invitationsCount }) {
  return (
    <Tabs>
      <Tabs.Header>
        <Tabs.Tab isSelected={selected === "team"}>Team</Tabs.Tab>
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
