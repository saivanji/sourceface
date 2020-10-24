import React, { useState } from "react"
import cx from "classnames"
import styles from "./index.scss"
import { Button, Toggle, Autocomplete } from "@sourceface/components"
import Link from "assets/link.svg"
import Add from "assets/add.svg"

export default ({ children, stock, value, onChange }) => {
  const [isOpened, setOpened] = useState(false)

  return !value || !value.length ? (
    <Creation stock={stock} />
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
            {React.Children.map(children, (item, i) => {
              return (
                <div className={styles.action} key={i}>
                  {item}
                </div>
              )
            })}
          </div>
          <Creation className={styles.add} stock={stock} />
        </>
      )}
    </>
  )
}

function Creation({ className, stock }) {
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
          {stock.list.map((item) => (
            <Autocomplete.Item key={item.type} onClick={close}>
              {item.type}
            </Autocomplete.Item>
          ))}
        </Autocomplete>
      )}
    </Toggle>
  )
}
