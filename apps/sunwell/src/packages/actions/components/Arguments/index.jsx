import React from "react"
import Action from "../Action"
import Value from "../Value"
import Static from "../Static"
import styles from "./index.scss"

// TODO: will have key/value split in the dropdown
export default function Arguments() {
  return (
    <Action.Section title="Input">
      <Action.SectionRow>
        <div className={styles.creators}>
          <Static creationTitle="Add key/value" />
          <Value creationTitle="Add group" />
        </div>
      </Action.SectionRow>
    </Action.Section>
  )
}
