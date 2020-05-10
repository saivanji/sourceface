import React from "react"
import { InviteForm } from "components/administration"
import Badge from "@sourceface/components/badge"
import Input from "@sourceface/components/input"
import Tabs, { Tab, TabsHead, TabsBody } from "@sourceface/components/tabs"
import Search from "./assets/search.svg"
import styles from "./index.css"

export default () => {
  return (
    <div className={styles.wrap}>
      <Tabs className={styles.tabs}>
        <TabsHead>
          <Tab isSelected>Users</Tab>
          <Tab iconAfter={<Badge value="30" />}>Invitations</Tab>
        </TabsHead>
        <TabsBody>
          <div className={styles.header}>
            <Input
              className={styles.search}
              type="text"
              placeholder="Search for a user"
              iconBefore={<Search />}
            />
            <InviteForm className={styles.inviteForm} />
          </div>
          Adipisicing blanditiis suscipit exercitationem maiores quis doloremque
          Aut iusto perferendis consequuntur tempora mollitia? Numquam
          voluptatibus eligendi assumenda commodi necessitatibus. Quisquam quae
          quaerat ex praesentium amet Corporis explicabo vitae soluta vel!
        </TabsBody>
      </Tabs>
    </div>
  )
}
