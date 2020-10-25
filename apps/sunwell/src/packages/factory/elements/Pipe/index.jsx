import React, { useState } from "react"
import cx from "classnames"
import { Button, Toggle, Autocomplete } from "@sourceface/components"
import Link from "assets/link.svg"
import Add from "assets/add.svg"
import { useContainer } from "../../container"
import { useConfiguration } from "../../configuration"
import styles from "./index.scss"

const definition = {
  query_id: "listOrders",
  args: [
    // {
    //   type: "group",
    //   value: {
    //     type: "action",
    //     action_id: 7,
    //   },
    // },
    {
      type: "key",
      key: "limit",
      value: {
        type: "literal",
        data: 5,
      },
    },
    {
      type: "key",
      key: "offset",
      value: {
        type: "literal",
        data: 8,
      },
    },
    {
      type: "key",
      key: "offset",
      value: {
        type: "local",
        name: "offset",
      },
    },
  ],
}

// TODO: when removing action from pipe, remove it from config first and then remove action itself so there
// would be no data inconsistency
export default ({ value = [], onChange }) => {
  const [isOpened, setOpened] = useState(false)
  const { module, onActionCreate } = useConfiguration()
  const { stock } = useContainer()

  const create = async (type) => {
    const action = await onActionCreate(type)
    onChange([...value, action.id])
  }

  const actions = value.map((id) => module.actions.find((x) => x.id === id))

  return !value || !value.length ? (
    <Creation onCreate={create} />
  ) : (
    <>
      <span
        onClick={() => setOpened((value) => !value)}
        className={cx(styles.link, isOpened && styles.opened)}
      >
        <Link className={styles.actionsIcon} />
        {actions.length} actions assigned
      </span>
      {isOpened && (
        <>
          <div className={styles.list}>
            {actions.map((action) => {
              const Component = stock.actions.dict[action.type].View

              return (
                <div key={action.id} className={styles.action}>
                  <Component config={action.config} />
                </div>
              )
            })}
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
        <Autocomplete>
          {stock.actions.list.map((item) => (
            <Autocomplete.Item
              key={item.type}
              onClick={() => {
                onCreate(item.type)
                close()
              }}
            >
              {item.type}
            </Autocomplete.Item>
          ))}
        </Autocomplete>
      )}
    </Toggle>
  )
}
