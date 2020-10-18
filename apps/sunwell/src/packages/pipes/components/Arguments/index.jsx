import React from "react"
import { Button, Dropdown } from "@sourceface/components"
import Add from "assets/add.svg"
import Action from "../Action"

export default function Arguments() {
  return (
    <Action.Section title="Input">
      <Dropdown>
        <Dropdown.Trigger>
          <Button size="small" appearance="link" icon={<Add />}>
            Add argument
          </Button>
        </Dropdown.Trigger>
        <Dropdown.Menu position="bottomLeft">
          <Dropdown.Item>As key</Dropdown.Item>
          <Dropdown.Item>As group</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </Action.Section>
  )
}
