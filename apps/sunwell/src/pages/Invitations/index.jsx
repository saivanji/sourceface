import React, { useState } from "react"
import { times } from "ramda"
import { UsersTabs } from "components/settings"
import { Layout } from "components/common"
import Button from "@sourceface/components/button"
import Dropdown from "@sourceface/components/dropdown"
import List from "@sourceface/components/list"
import Loader from "@sourceface/components/loader"
import Modal from "@sourceface/components/modal"
import Pagination from "@sourceface/components/pagination"
import AlertIcon from "assets/alert.svg"
import MoreIcon from "assets/more.svg"
import styles from "./index.scss"

export default () => {
  const [page, setPage] = useState(0)
  const [isRemoving, setRemoving] = useState(false)

  return (
    <>
      <Layout>
        <UsersTabs selected="invitations" invitationsCount={30}>
          <Loader>
            <Items setRemoving={setRemoving} />
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
      <RemovalModal isRemoving={isRemoving} setRemoving={setRemoving} />
    </>
  )
}

function Items({ setRemoving }) {
  return (
    <List>
      {times(
        i => (
          <List.Item className={styles.invitation} key={i}>
            <span>aiven715@gmail.com</span>
            <span className={styles.date}>25 days ago</span>
            <Dropdown className={styles.more}>
              <Dropdown.Trigger>
                <Button appearance="secondary" size="compact">
                  <MoreIcon />
                </Button>
              </Dropdown.Trigger>
              <Dropdown.Menu>
                <Dropdown.Item>Resend email</Dropdown.Item>
                <Dropdown.Item onClick={() => setRemoving(true)}>
                  Remove invitation
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </List.Item>
        ),
        5
      )}
    </List>
  )
}

function RemovalModal({ isRemoving, setRemoving }) {
  return (
    <Modal isOpened={isRemoving} onDismiss={() => setRemoving(false)}>
      <Modal.Header iconBefore={<AlertIcon />}>Remove invitation</Modal.Header>
      <Modal.Body>
        Are you sure that you want to remove that invitation?
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
