import React from "react"
import { without } from "ramda"
import { Autocomplete, Button, Toggle } from "@sourceface/components"
import {
  useContainer,
  useConfiguration,
  useEditor,
  Action,
} from "packages/factory"
import Add from "assets/add.svg"
import Card from "./Card"
import styles from "./index.scss"

export default ({ value = [], onChange }) => {
  const { module } = useConfiguration()
  const { selectors, createAction, removeAction, renameAction } = useEditor()

  const create = (type) => {
    const actionId = createAction(module.id, type)
    onChange([...value, actionId])
  }

  const remove = (actionId) => {
    removeAction(actionId)
    onChange(without([actionId], value))
  }

  const actions = selectors.actions(value)

  return !actions.length ? (
    <Creation onCreate={create} />
  ) : (
    <>
      <div className={styles.list}>
        {actions.map((action) => (
          <div key={action.id} className={styles.action}>
            <Action action={action}>
              {(root, cut) => (
                <Card
                  cut={cut}
                  name={action.name}
                  onRename={(name) => renameAction(action.id, name)}
                  onRemove={() => remove(action.id)}
                >
                  {root}
                </Card>
              )}
            </Action>
          </div>
        ))}
      </div>
      <Creation className={styles.add} onCreate={create} />
    </>
  )
}

function Creation({ className, onCreate }) {
  const { stock } = useContainer()

  const trigger = (
    <Button
      className={className}
      shouldFitContainer
      size="small"
      appearance="link"
      icon={<Add />}
    >
      Add action
    </Button>
  )

  return (
    <Toggle trigger={trigger}>
      {(close) => (
        <Autocomplete
          placeholder="Choose action..."
          items={stock.actions.list}
          map={(item) => ({ title: item.type, value: item.type })}
          onChange={(value) => {
            onCreate(value)
            close()
          }}
        />
      )}
    </Toggle>
  )
}
