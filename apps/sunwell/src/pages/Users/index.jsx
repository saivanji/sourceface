import React from "react"
import { InviteForm } from "components/administration"
import Input from "@sourceface/components/input"
import styles from "./index.css"
import Tabs from "./Tabs"

// take into the account gray bg of content area??
// or bg of content area will be white?
export default () => {
  return (
    <div className={styles.wrap}>
      <Tabs className={styles.tabs} />
      <div className={styles.header}>
        <Input type="text" placeholder="Search for a user" />
        <InviteForm className={styles.inviteForm} />
      </div>
    </div>
  )
}
