import React from "react"
import Avatar from "@sourceface/components/avatar"
import Breadcrumbs from "@sourceface/components/breadcrumbs"
import Dropdown from "@sourceface/components/dropdown"
import Navbar from "@sourceface/components/navbar"
import Sidemenu from "@sourceface/components/sidemenu"
import Sidepane from "@sourceface/components/sidepane"
import ContentIcon from "assets/content-line.svg"
import GroupIcon from "assets/group-line.svg"
import LockIcon from "assets/lock-line.svg"
import QuestionIcon from "assets/question-line.svg"
import SettingsIcon from "assets/settings-line.svg"
import ShieldIcon from "assets/shield-line.svg"
import StackIcon from "assets/stack-line.svg"
import styles from "./index.css"

const items = [
  {
    name: "Home",
    link: "/",
  },
  {
    name: "Settings",
    link: "/settings",
  },
  {
    name: "Users",
    link: "/settings/users",
  },
]

// will be getting current page object from Page provided context and depending on it will render the data in breadcrumbs and sidebar
export default ({ children }) => {
  return (
    <div className={styles.root}>
      <Sidepane>
        <Sidepane.Logo />
        <Sidepane.Link href="#">
          <ContentIcon />
        </Sidepane.Link>
        <div className={styles.bottom}>
          <Sidepane.Link href="#">
            <QuestionIcon />
          </Sidepane.Link>
          <Sidepane.Link href="#">
            <StackIcon />
          </Sidepane.Link>
          <Sidepane.Link href="#">
            <SettingsIcon />
          </Sidepane.Link>
        </div>
      </Sidepane>
      <Sidemenu>
        <Sidemenu.Title>Settings</Sidemenu.Title>
        <Sidemenu.Group>
          <Sidemenu.GroupTitle>Personal</Sidemenu.GroupTitle>
          <Sidemenu.GroupLink href="#" iconBefore={<ShieldIcon />}>
            Security
          </Sidemenu.GroupLink>
        </Sidemenu.Group>
        <Sidemenu.Group>
          <Sidemenu.GroupTitle>Organization</Sidemenu.GroupTitle>
          <Sidemenu.GroupLink href="#" iconBefore={<GroupIcon />} isSelected>
            Users management
          </Sidemenu.GroupLink>
          <Sidemenu.GroupLink href="#" iconBefore={<LockIcon />}>
            Access management
          </Sidemenu.GroupLink>
        </Sidemenu.Group>
      </Sidemenu>
      <Navbar>
        <Breadcrumbs items={items} />
        <Dropdown className={styles.profile}>
          <Dropdown.Trigger>
            <button className={styles.avatar}>
              <Avatar value="A" />
            </button>
          </Dropdown.Trigger>
          <Dropdown.Menu>
            <Dropdown.Item>Sign out</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Navbar>
      <div className={styles.content}>{children}</div>
    </div>
  )
}
