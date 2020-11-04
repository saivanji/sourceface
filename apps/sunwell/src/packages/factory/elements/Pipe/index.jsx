import React, { useState } from "react"
import cx from "classnames"
import { Autocomplete, Button, Toggle } from "@sourceface/components"
import Link from "assets/link.svg"
import Add from "assets/add.svg"
import { useContainer } from "../../container"
import { useConfiguration } from "../../configuration"
import { useEditor } from "../../editor"
import styles from "./index.scss"

// TODO: move to actions and re-export in factory?

// TODO: when at least one action created, have Creation inside of a link as "+" in the right side?
export default ({ value = [], onChange }) => {
  const [isOpened, setOpened] = useState(false)
  const { module } = useConfiguration()
  const { createAction } = useEditor()

  const open = () => setOpened(true)
  const toggle = () => setOpened((value) => !value)

  const create = (type) => {
    const actionId = createAction(module.id, type)
    onChange([...value, actionId])
    open()
  }

  /**
   * Matching actions by config ids and filtering out wrong links.
   */
  const actions = value
    .map((id) => module.actions.find((x) => x.id === id))
    .filter(Boolean)

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
              <Action key={action.id} {...action} />
            ))}
          </div>
          <Creation className={styles.add} onCreate={create} />
        </>
      )}
    </>
  )
}

function Action({ id, config, type, onRemove }) {
  const { stock, queries } = useContainer()
  const { configureAction, removeAction } = useEditor()

  const Component = stock.actions.dict[type].Root

  return (
    <div key={id} className={styles.action}>
      <Component
        queries={queries}
        config={config}
        onConfigChange={(key, value) => configureAction(id, key, value)}
      />
    </div>
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
