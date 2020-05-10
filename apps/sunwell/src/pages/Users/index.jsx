import React from "react"
import { InviteForm } from "components/administration"
import Avatar from "@sourceface/components/avatar"
import Badge from "@sourceface/components/badge"
import Input from "@sourceface/components/input"
import List, { Item } from "@sourceface/components/list"
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
          <List>
            <Item>
              <Avatar value="A" />
              <span className={styles.email}>aiven715@gmail.com</span>
            </Item>
            <Item>
              <Avatar value="A" />
              <span className={styles.email}>aiven715@gmail.com</span>
            </Item>
            <Item>
              <Avatar value="A" />
              <span className={styles.email}>aiven715@gmail.com</span>
            </Item>
            <Item>
              <Avatar value="A" />
              <span className={styles.email}>aiven715@gmail.com</span>
            </Item>
          </List>
        </TabsBody>
      </Tabs>
    </div>
  )
}
