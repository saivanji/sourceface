import React from "react"
import cx from "classnames"
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

export default ({ label, value = [], onChange }) => {
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

  // TODO: implement toggling of existing actions?
  return !actions.length ? (
    <Label title={label} onCreate={create} />
  ) : (
    <>
      <Label title={label} populated onCreate={create} />
      <div>
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
    </>
  )
}

function Label({ title, populated, onCreate }) {
  const { stock } = useContainer()

  return (
    <div className={cx(styles.label, populated && styles.populated)}>
      <span className={styles.title}>{title}</span>
      <Toggle
        className={styles.add}
        position="bottomRight"
        trigger={
          <Button appearance="link" size="small" icon={<Add />}>
            Add action
          </Button>
        }
      >
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
    </div>
  )
}
