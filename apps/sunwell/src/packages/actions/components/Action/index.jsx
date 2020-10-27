import React, { useState, Children } from "react"
import cx from "classnames"
import styles from "./index.scss"
import BottomArrow from "assets/chev-b.svg"
import TopArrow from "assets/chev-t.svg"
import Guide from "assets/guide.svg"
import Delete from "assets/delete.svg"

export default function Action({ children, secondary, add = false }) {
  const [isOpened, setOpened] = useState(false)

  return (
    <div className={styles.root}>
      <div className={styles.head}>
        <span className={styles.name}>Unnamed</span>
        <Delete onClick={() => {}} className={styles.deleteIcon} />
      </div>
      <div className={cx(styles.body, styles.group)}>
        {wrapText(children)}
        {add && <span className={styles.add}>+</span>}
      </div>
      {secondary && !isOpened ? (
        <div className={styles.show} onClick={() => setOpened(true)}>
          ---
          <BottomArrow className={styles.bottomIcon} />
        </div>
      ) : (
        isOpened && (
          <div className={styles.expanded}>
            {secondary}{" "}
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

Action.Group = function ActionGroup({ children }) {
  return <div className={styles.group}>{wrapText(children)}</div>
}

Action.Section = function ActionSection({ title, children }) {
  return (
    <div className={styles.section}>
      <div className={styles.sectionHead}>
        <span className={styles.sectionTitle}>{title}</span>
      </div>
      <div className={styles.sectionBody}>{children}</div>
    </div>
  )
}

Action.SectionRow = function ActionSectionRow({ children }) {
  return <div className={styles.sectionRow}>{children}</div>
}

const wrapText = (children) =>
  Children.map(children, (node) =>
    typeof node === "string" ? (
      <span className={styles.text}>{node}</span>
    ) : (
      node
    )
  )