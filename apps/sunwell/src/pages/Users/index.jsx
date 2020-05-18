import React, { useState } from "react"
import { times } from "ramda"
import Avatar from "@sourceface/components/avatar"
import Badge from "@sourceface/components/badge"
import Button from "@sourceface/components/button"
import Dropdown from "@sourceface/components/dropdown"
import Input from "@sourceface/components/input"
import Loader from "@sourceface/components/loader"
import Modal from "@sourceface/components/modal"
import Pagination from "@sourceface/components/pagination"
import { InviteForm, UsersTabs } from "components/settings"
import { Layout } from "components/common"
import SearchIcon from "assets/search.svg"
import AlertIcon from "assets/alert.svg"
import MoreIcon from "assets/more.svg"
import styles from "./index.scss"
import Table from "./Table"

export default () => {
  const [page, setPage] = useState(0)
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
            <InviteForm />
          </div>
          <Loader>
            <UsersTable
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
      <PassModal
        isChangingPass={isChangingPass}
        setChangingPass={setChangingPass}
      />
      <RemovalModal isRemoving={isRemoving} setRemoving={setRemoving} />
    </>
  )
}

function UsersTable({ setChangingPass, setRemoving }) {
  return (
    <Table>
      <Table.Head>
        <Table.Heading>Email</Table.Heading>
        <Table.Heading>Groups</Table.Heading>
        <Table.Heading />
      </Table.Head>
      {times(
        i => (
          <Table.Row key={i}>
            <Table.Cell>
              <Avatar value="A" />
              <span className={styles.email}>aiven715@gmail.com</span>
            </Table.Cell>
            <Table.Cell>
              <Badge value="root" appearance="light" shape="squared" />
            </Table.Cell>
            <Table.Cell align="right">
              <Dropdown className={styles.more}>
                <Dropdown.Trigger>
                  <Button appearance="secondary" size="compact">
                    <MoreIcon />
                  </Button>
                </Dropdown.Trigger>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => setChangingPass(true)}>
                    Change password
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => setRemoving(true)}>
                    Remove from the app
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Table.Cell>
          </Table.Row>
        ),
        5
      )}
    </Table>
  )
}

function PassModal({ isChangingPass, setChangingPass }) {
  return (
    <Modal
      size="compact"
      isOpened={isChangingPass}
      onDismiss={() => setChangingPass(false)}
    >
      <Modal.Header>Change password of aiven715</Modal.Header>
      <Modal.Body>
        Please, do not forget to tell the new password to the user
        <Input
          className={styles.newPassword}
          type="password"
          placeholder="New password"
        />
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => setChangingPass(false)} appearance="secondary">
          Cancel
        </Button>
        <Button>Submit</Button>
      </Modal.Footer>
    </Modal>
  )
}

function RemovalModal({ isRemoving, setRemoving }) {
  return (
    <Modal isOpened={isRemoving} onDismiss={() => setRemoving(false)}>
      <Modal.Header iconBefore={<AlertIcon />}>
        Remove aiven715 user
      </Modal.Header>
      <Modal.Body>
        Are you sure that you want to remove that user? This can not be undone
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => setRemoving(false)} appearance="secondary">
          Cancel
        </Button>
        <Button>Submit</Button>
      </Modal.Footer>
    </Modal>
  )
}
