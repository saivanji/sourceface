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

export default ({ value, onChange }) => {
  const [isOpened, setOpened] = useState(false)
  const { stock } = useContainer()

  const items = [
    <stock.actions.dict.runQuery.View definition={definition} />,
    <stock.actions.dict.redirect.View />,
  ]

  return !value || !value.length ? (
    <Creation />
  ) : (
    <>
      <span
        onClick={() => setOpened((value) => !value)}
        className={cx(styles.link, isOpened && styles.opened)}
      >
        <Link className={styles.actionsIcon} />3 actions assigned
      </span>
      {isOpened && (
        <>
          <div className={styles.list}>
            {items.map((item, i) => {
              return (
                <div className={styles.action} key={i}>
                  {item}
                </div>
              )
            })}
          </div>
          <Creation className={styles.add} />
        </>
      )}
    </>
  )
}

function Creation({ className }) {
  const { stock } = useContainer()
  const { onActionCreate } = useConfiguration()

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
                onActionCreate(item.type)
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
