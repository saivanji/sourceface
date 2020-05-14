import React, { useState } from "react"
import { times } from "ramda"
import { InviteForm, UsersTabs } from "components/settings"
import { Layout } from "components/common"
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
import Loader from "@sourceface/components/loader"
import Modal, {
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@sourceface/components/modal"
import Pagination from "@sourceface/components/pagination"
import Select from "@sourceface/components/select"
import SearchIcon from "assets/search.svg"
import AlertIcon from "assets/alert.svg"
import MoreIcon from "assets/more.svg"
import styles from "./index.css"

export default () => {
  const [page, setPage] = useState(0)
  const [isChangingGroups, setChangingGroups] = useState(false)
  const [isChangingPass, setChangingPass] = useState(false)
  const [isRemoving, setRemoving] = useState(false)

  return (
    <>
      <Layout>
        <UsersTabs selected="users" invitationsCount={30}>
          <div className={styles.header}>
            <Input
              className={styles.search}
              type="text"
              placeholder="Search for a user"
              iconBefore={<SearchIcon />}
            />
            <InviteForm className={styles.inviteForm} />
          </div>
          <Loader>
            <Items
              setChangingGroups={setChangingGroups}
              setChangingPass={setChangingPass}
              setRemoving={setRemoving}
            />
          </Loader>
          <Pagination
            className={styles.pagination}
            pageCount={30}
            pageMargin={1}
            pageSurroundings={1}
            onPageClick={setPage}
            selectedPage={page}
          />
        </UsersTabs>
      </Layout>
      <GroupsModal
        isChangingGroups={isChangingGroups}
        setChangingGroups={setChangingGroups}
      />
      <PassModal
        isChangingPass={isChangingPass}
        setChangingPass={setChangingPass}
      />
      <RemovalModal isRemoving={isRemoving} setRemoving={setRemoving} />
    </>
  )
}

function Items({ setChangingGroups, setChangingPass, setRemoving }) {
  return (
    <List>
      {times(
        i => (
          <Item className={styles.user} key={i}>
            <Avatar value="A" />
            <span className={styles.email}>aiven715@gmail.com</span>
            <Badge
              className={styles.group}
              value="root"
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
                <DropdownItem onClick={() => setChangingGroups(true)}>
                  Change groups
                </DropdownItem>
                <DropdownItem onClick={() => setChangingPass(true)}>
                  Change password
                </DropdownItem>
                <DropdownItem onClick={() => setRemoving(true)}>
                  Remove from the app
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </Item>
        ),
        5
      )}
    </List>
  )
}

function GroupsModal({ isChangingGroups, setChangingGroups }) {
  return (
    <Modal
      size="compact"
      isOpened={isChangingGroups}
      onDismiss={() => setChangingGroups(false)}
    >
      <ModalHeader>Change groups of aiven715</ModalHeader>
      <ModalBody>
        Note, that users with privileged group have full control over the
        application.
        <Select
          className={styles.groupsSelect}
          placeholder="Select groups"
          options={[
            {
              label: (
                <>
                  root
                  <Badge
                    className={styles.privileged}
                    shape="squared"
                    value="Privileged"
                  />
                </>
              ),
              value: "root",
            },
            {
              label: "product",
              value: "product",
            },
            {
              label: "orders",
              value: "orders",
            },
          ]}
        />
      </ModalBody>
      <ModalFooter>
        <Button onClick={() => setChangingGroups(false)} appearance="secondary">
          Cancel
        </Button>
        <Button>Submit</Button>
      </ModalFooter>
    </Modal>
  )
}

function PassModal({ isChangingPass, setChangingPass }) {
  return (
    <Modal
      size="compact"
      isOpened={isChangingPass}
      onDismiss={() => setChangingPass(false)}
    >
      <ModalHeader>Change password of aiven715</ModalHeader>
      <ModalBody>
        Please, do not forget to tell the new password to the user
        <Input
          className={styles.newPassword}
          type="password"
          placeholder="New password"
        />
      </ModalBody>
      <ModalFooter>
        <Button onClick={() => setChangingPass(false)} appearance="secondary">
          Cancel
        </Button>
        <Button>Submit</Button>
      </ModalFooter>
    </Modal>
  )
}

function RemovalModal({ isRemoving, setRemoving }) {
  return (
    <Modal isOpened={isRemoving} onDismiss={() => setRemoving(false)}>
      <ModalHeader iconBefore={<AlertIcon />}>Remove aiven715 user</ModalHeader>
      <ModalBody>
        Are you sure that you want to remove that user? This can not be undone
      </ModalBody>
      <ModalFooter>
        <Button onClick={() => setRemoving(false)} appearance="secondary">
          Cancel
        </Button>
        <Button>Submit</Button>
      </ModalFooter>
    </Modal>
  )
}
