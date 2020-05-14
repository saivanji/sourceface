import React, { useState } from "react"
import { times } from "ramda"
import { UsersTabs } from "components/settings"
import { Layout } from "components/common"
import Button from "@sourceface/components/button"
import Dropdown, {
  DropdownButton,
  DropdownMenu,
  DropdownItem,
} from "@sourceface/components/dropdown"
import List, { Item } from "@sourceface/components/list"
import Loader from "@sourceface/components/loader"
import Modal, {
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@sourceface/components/modal"
import Pagination from "@sourceface/components/pagination"
import AlertIcon from "assets/alert.svg"
import MoreIcon from "assets/more.svg"
import styles from "./index.css"

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
      <Modals isRemoving={isRemoving} setRemoving={setRemoving} />
    </>
  )
}

function Items({ setRemoving }) {
  return (
    <List>
      {times(
        i => (
          <Item className={styles.invitation} key={i}>
            <span>aiven715@gmail.com</span>
            <span className={styles.date}>25 days ago</span>
            <Dropdown className={styles.more}>
              <DropdownButton>
                <Button appearance="secondary" size="compact">
                  <MoreIcon />
                </Button>
              </DropdownButton>
              <DropdownMenu>
                <DropdownItem>Resend email</DropdownItem>
                <DropdownItem onClick={() => setRemoving(true)}>
                  Remove invitation
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

function Modals({ isRemoving, setRemoving }) {
  return (
    <>
      <Modal isOpened={isRemoving} onDismiss={() => setRemoving(false)}>
        <ModalHeader iconBefore={<AlertIcon />}>Remove invitation</ModalHeader>
        <ModalBody>
          Are you sure that you want to remove that invitation?
        </ModalBody>
        <ModalFooter>
          <Button onClick={() => setRemoving(false)} appearance="secondary">
            Cancel
          </Button>
          <Button>Submit</Button>
        </ModalFooter>
      </Modal>
    </>
  )
}
