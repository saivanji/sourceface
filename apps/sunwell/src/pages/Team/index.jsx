import React, { useState } from "react"
import { times } from "ramda"
import {
  Avatar,
  Badge,
  Button,
  Dropdown,
  Input,
  Loader,
  Modal,
  Table,
} from "@sourceface/components"
import { InviteForm, UsersTabs } from "components/settings"
import { Layout } from "components/common"
import SearchIcon from "assets/search.svg"
import AlertIcon from "assets/alert.svg"
import MoreIcon from "assets/more.svg"
import styles from "./index.scss"

export default () => {
  // const [page, setPage] = useState(0)
  const [isChangingPass, setChangingPass] = useState(false)
  const [isRemoving, setRemoving] = useState(false)

  return (
    <>
      <Layout>
        <UsersTabs selected="team" invitationsCount={30}>
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
            <TeamTable
              setChangingPass={setChangingPass}
              setRemoving={setRemoving}
            />
          </Loader>
          {
            // <Pagination
            //   className={styles.pagination}
            //   pageCount={30}
            //   pageMargin={1}
            //   pageSurroundings={1}
            //   onPageClick={setPage}
            //   selectedPage={page}
            // />
          }
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

function TeamTable({ setChangingPass, setRemoving }) {
  return (
    <Table columns={["16rem", "auto", "4rem"]}>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Email</Table.Th>
          <Table.Th>Groups</Table.Th>
          <Table.Th />
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {times(
          i => (
            <Table.Tr key={i}>
              <Table.Td>
                <Avatar value="A" />
                <span className={styles.email}>aiven715@gmail.com</span>
              </Table.Td>
              <Table.Td>
                <Badge value="root" appearance="light" />
              </Table.Td>
              <Table.Td align="right">
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
              </Table.Td>
            </Table.Tr>
          ),
          5
        )}
      </Table.Tbody>
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
