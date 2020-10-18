import React, { useState } from "react"
import { Button, Dropdown } from "@sourceface/components"
import Add from "assets/add.svg"
import { Value } from "../../inputs"
import Action from "../Action"
import Snippet from "../Snippet"

export default function Arguments() {
  const [creation, setCreation] = useState(null)

  return (
    <Action.Section title="Input">
      <Action.SectionRow>
        {!creation ? (
          <Dropdown>
            <Dropdown.Trigger>
              <Button size="small" appearance="link" icon={<Add />}>
                Add argument
              </Button>
            </Dropdown.Trigger>
            <Dropdown.Menu position="bottomLeft">
              <Dropdown.Item onClick={() => setCreation({ type: "key" })}>
                As key
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() =>
                  setCreation({
                    type: "group",
                    value: { type: "local", name: "" },
                  })
                }
              >
                As group
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        ) : creation.type === "key" ? (
          <>
            <Snippet
              autoFocus
              color="gray"
              value={creation.key}
              onChange={(key) => setCreation((data) => ({ ...data, key }))}
            />
            {creation.key && !creation.value ? (
              <Button
                size="small"
                appearance="link"
                icon={<Add />}
                onClick={() =>
                  setCreation((data) => ({
                    ...data,
                    value: { type: "local", name: "" },
                  }))
                }
              >
                Add value
              </Button>
            ) : (
              !!creation.value && <Value autoFocus value={creation.value} />
            )}
          </>
        ) : (
          creation.type === "group" && (
            <Value
              autoFocus
              value={creation.value}
              onChange={(value) => setCreation((data) => ({ ...data, value }))}
            />
          )
        )}
      </Action.SectionRow>
    </Action.Section>
  )
}
