import React, { useState } from "react"
import cx from "classnames"
import Input from "react-input-autosize"
import { Dropdown, Toggle } from "@sourceface/components"
import BottomArrow from "assets/chev-b.svg"
import TopArrow from "assets/chev-t.svg"
import More from "assets/more.svg"
import styles from "./card.scss"

export default function Card({
  children,
  cut,
  add = false,
  name,
  onRename,
  onRemove,
}) {
  const [isOpened, setOpened] = useState(false)
  const [isRenaming, setRenaming] = useState(false)

  const enableRenaming = () => setRenaming(true)
  const disableRenaming = () => setRenaming(false)

  return (
    <div className={styles.root}>
      <div className={styles.primary}>
        <div className={styles.head}>
          {(name || isRenaming) && (
            <Input
              autoFocus={isRenaming}
              value={name || ""}
              inputClassName={styles.name}
              placeholder="Unnamed"
              onChange={(e) => onRename(e.target.value)}
              onBlur={(e) => !e.target.value && disableRenaming()}
            />
          )}
          <Toggle
            position="bottomRight"
            className={styles.more}
            trigger={(isOpened) => (
              <button
                className={cx(styles.moreIcon, isOpened && styles.visible)}
              >
                <More />
              </button>
            )}
          >
            {(close) => (
              <ExtraMenu
                renameDisabled={!!name}
                onClick={close}
                onRenameClick={enableRenaming}
                onRemoveClick={onRemove}
              />
            )}
          </Toggle>
        </div>
        <div className={styles.body}>
          {children}
          {add && <span className={styles.add}>+</span>}
        </div>
      </div>
      {cut && !isOpened ? (
        <div className={styles.show} onClick={() => setOpened(true)}>
          ---
          <BottomArrow className={styles.bottomIcon} />
        </div>
      ) : (
        isOpened && (
          <div className={styles.expanded}>
            {cut}{" "}
            <TopArrow
              className={styles.topIcon}
              onClick={() => setOpened(false)}
            />
          </div>
        )
      )}
    </div>
  )
}

function ExtraMenu({ renameDisabled, onClick, onRenameClick, onRemoveClick }) {
  const click = (fn) => () => {
    onClick()
    fn()
  }

  return (
    <Dropdown size="small">
      {!renameDisabled && (
        <Dropdown.Item onClick={click(onRenameClick)}>Rename</Dropdown.Item>
      )}
      <Dropdown.Item onClick={click(onRemoveClick)}>Delete</Dropdown.Item>
    </Dropdown>
  )
}
