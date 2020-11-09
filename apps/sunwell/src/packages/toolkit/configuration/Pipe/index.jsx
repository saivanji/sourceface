import React, { useState } from "react"
import cx from "classnames"
import { without } from "ramda"
import { Autocomplete, Button, Toggle } from "@sourceface/components"
import {
  useContainer,
  useConfiguration,
  useEditor,
  Action,
} from "packages/factory"
import Link from "assets/link.svg"
import Add from "assets/add.svg"
import Card from "./Card"
import styles from "./index.scss"

// TODO: when at least one action created, have Creation inside of a link as "+" in the right side?
export default ({ value = [], onChange }) => {
  const [isOpened, setOpened] = useState(false)
  const { module } = useConfiguration()
  const { selectors, createAction, removeAction, renameAction } = useEditor()

  const open = () => setOpened(true)
  const toggle = () => setOpened((value) => !value)

  const create = (type) => {
    const actionId = createAction(module.id, type)
    onChange([...value, actionId])
    open()
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
      <span
        onClick={toggle}
        className={cx(styles.link, isOpened && styles.opened)}
      >
        <Link className={styles.actionsIcon} />
        {actions.length} actions assigned
      </span>
      {isOpened && (
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
      )}
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
