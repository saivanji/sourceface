import React from "react"
import { times } from "ramda"
import { InviteForm } from "components/administration"
import Avatar from "@sourceface/components/avatar"
import Badge from "@sourceface/components/badge"
import Button from "@sourceface/components/button"
import Input from "@sourceface/components/input"
import List, { Item } from "@sourceface/components/list"
import Tabs, { Tab, TabsHead, TabsBody } from "@sourceface/components/tabs"
import SearchIcon from "./assets/search.svg"
import MoreIcon from "./assets/more.svg"
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
              iconBefore={<SearchIcon />}
            />
            <InviteForm className={styles.inviteForm} />
          </div>
          <List>
            {times(
              i => (
                <Item className={styles.user} key={i}>
                  <Avatar value="A" />
                  <span className={styles.email}>aiven715@gmail.com</span>
                  <Badge
                    className={styles.role}
                    value="admin"
                    appearance="light"
                    shape="squared"
                  />
                  <Button
                    className={styles.more}
                    appearance="secondary"
                    size="compact"
                  >
                    <MoreIcon />
                  </Button>
                </Item>
              ),
              5
            )}
          </List>
        </TabsBody>
      </Tabs>
    </div>
  )
}
