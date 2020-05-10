import React from "react"
import { InviteForm } from "components/administration"
import Input from "@sourceface/components/input"
import Tabs, { Tab } from "@sourceface/components/tabs"
import Search from "./assets/search.svg"
import styles from "./index.css"

// take into the account gray bg of content area??
// or bg of content area will be white?
export default () => {
  return (
    <div className={styles.wrap}>
      <Tabs className={styles.tabs}>
        <Tab isSelected>Users</Tab>
        <Tab>Invitations</Tab>
      </Tabs>
      <div className={styles.header}>
        <Input
          className={styles.search}
          type="text"
          placeholder="Search for a user"
          iconBefore={<Search />}
        />
        <InviteForm className={styles.inviteForm} />
      </div>
    </div>
  )
}
