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
import Modal, {
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@sourceface/components/modal"
import Pagination from "@sourceface/components/pagination"
import Tabs, { Tab, TabsHeader, TabsBody } from "@sourceface/components/tabs"
import SearchIcon from "./assets/search.svg"
import AlertIcon from "./assets/alert.svg"
import MoreIcon from "./assets/more.svg"
import styles from "./index.css"

export default () => {
  const [page, setPage] = useState(0)
  const [changingRole, setChangingRole] = useState(false)
  const [removingUser, setRemovingUser] = useState(false)

  return (
    <>
      <div className={styles.wrap}>
        <Tabs className={styles.tabs}>
          <TabsHeader>
            <Tab isSelected>Users</Tab>
            <Tab iconAfter={<Badge value="30" />}>Invitations</Tab>
          </TabsHeader>
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
                        <DropdownItem onClick={() => setChangingRole(true)}>
                          Change role
                        </DropdownItem>
                        <DropdownItem onClick={() => setRemovingUser(true)}>
                          Remove from the app
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </Item>
                ),
                5
              )}
            </List>
            <Pagination
              className={styles.pagination}
              pageCount={30}
              pageMargin={1}
              pageSurroundings={1}
              onPageClick={setPage}
              selectedPage={page}
            />
          </TabsBody>
        </Tabs>
      </div>
      <Modal
        size="compact"
        isOpened={changingRole}
        onDismiss={() => setChangingRole(false)}
      >
        <ModalHeader>Change user role</ModalHeader>
        <ModalBody>
          Consectetur voluptate temporibus dolorum molestiae autem Eveniet
          voluptates earum asperiores ipsa dicta. Vero quidem itaque culpa
          aperiam vero. Qui officia!
        </ModalBody>
        <ModalFooter>
          <Button onClick={() => setChangingRole(false)} appearance="secondary">
            Cancel
          </Button>
          <Button>Submit</Button>
        </ModalFooter>
      </Modal>
      <Modal
        size="compact"
        isOpened={removingUser}
        onDismiss={() => setRemovingUser(false)}
      >
        <ModalHeader iconBefore={<AlertIcon />}>User removal</ModalHeader>
        <ModalBody>
          Are you sure that you want to remove that user? This can not be undone
        </ModalBody>
        <ModalFooter>
          <Button onClick={() => setRemovingUser(false)} appearance="secondary">
            Cancel
          </Button>
          <Button>Submit</Button>
        </ModalFooter>
      </Modal>
    </>
  )
}
