import React, { useState } from "react"
import { times } from "ramda"
import { InviteForm } from "components/administration"
import Avatar from "@sourceface/components/avatar"
import Badge from "@sourceface/components/badge"
import Button from "@sourceface/components/button"
import Dropdown, {
  DropdownButton,
  DropdownMenu,
  DropdownItem,
} from "@sourceface/components/dropdown"
import Input from "@sourceface/components/input"
import List, { Item } from "@sourceface/components/list"
// import Pagination from "@sourceface/components/pagination"
import Tabs, { Tab, TabsHead, TabsBody } from "@sourceface/components/tabs"
import SearchIcon from "./assets/search.svg"
import MoreIcon from "./assets/more.svg"
import styles from "./index.css"
import Pagination from "./Pagination"

export default () => {
  const [page, setPage] = useState(0)

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
                  <Dropdown className={styles.more}>
                    <DropdownButton>
                      <Button appearance="secondary" size="compact">
                        <MoreIcon />
                      </Button>
                    </DropdownButton>
                    <DropdownMenu>
                      <DropdownItem>Change role</DropdownItem>
                      <DropdownItem>Remove from the app</DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </Item>
              ),
              5
            )}
          </List>
          <Pagination
            className={styles.pagination}
            pageCount={9}
            pageMargin={1}
            pageSurroundings={2}
            onPageClick={setPage}
            selectedPage={page}
          />
        </TabsBody>
      </Tabs>
    </div>
  )
}
