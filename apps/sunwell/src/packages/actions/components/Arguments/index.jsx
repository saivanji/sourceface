import React, { useState } from "react"
import { Button } from "@sourceface/components"
import Add from "assets/add.svg"
import Action from "../Action"
import Value from "../Value"
import Snippet from "../Snippet"
import styles from "./index.scss"

export default function Arguments() {
  const [creation, setCreation] = useState(null)

  const stopCreation = () => setCreation(null)

  return (
    <Action.Section title="Input">
      <Action.SectionRow>
        {!creation ? (
          <div className={styles.creators}>
            <AddButton onClick={() => setCreation({ type: "key" })}>
              Add key
            </AddButton>
            <AddButton
              onClick={() =>
                setCreation({
                  type: "group",
                  value: { type: "local", name: "" },
                })
              }
            >
              Add group
            </AddButton>
          </div>
        ) : creation.type === "key" ? (
          <>
            <Snippet
              autoFocus
              color="gray"
              value={creation.key}
              onChange={(key) => setCreation((data) => ({ ...data, key }))}
              onDestroy={stopCreation}
            />
            {creation.key && !creation.value ? (
              <AddButton
                onClick={() =>
                  setCreation((data) => ({
                    ...data,
                    value: { type: "local", name: "" },
                  }))
                }
              >
                Add value
              </AddButton>
            ) : (
              !!creation.value && (
                <Value
                  autoFocus
                  value={creation.value}
                  onDestroy={() =>
                    setCreation((data) => ({
                      ...data,
                      value: undefined,
                    }))
                  }
                />
              )
            )}
          </>
        ) : (
          creation.type === "group" && (
            <Value
              autoFocus
              value={creation.value}
              onChange={(value) => setCreation((data) => ({ ...data, value }))}
              onDestroy={stopCreation}
            />
          )
        )}
      </Action.SectionRow>
    </Action.Section>
  )
}

function AddButton({ children, onClick }) {
  return (
    <Button onClick={onClick} size="small" appearance="link" icon={<Add />}>
      {children}
    </Button>
  )
}

function Creation() {}
