import React from "react"
import Avatar from "@sourceface/components/avatar"
import Breadcrumbs from "@sourceface/components/breadcrumbs"
import Dropdown from "@sourceface/components/dropdown"
import Navbar from "@sourceface/components/navbar"
import Sidebar from "@sourceface/components/sidebar"
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
      <Sidebar>
        <Sidebar.Pane>
          <Sidebar.PaneLogo />
          <Sidebar.PaneLink href="#">
            <ContentIcon />
          </Sidebar.PaneLink>
          <div className={styles.bottom}>
            <Sidebar.PaneLink href="#">
              <QuestionIcon />
            </Sidebar.PaneLink>
            <Sidebar.PaneLink href="#">
              <StackIcon />
            </Sidebar.PaneLink>
            <Sidebar.PaneLink href="#">
              <SettingsIcon />
            </Sidebar.PaneLink>
          </div>
        </Sidebar.Pane>
        <Sidebar.Menu>
          <Sidebar.MenuTitle>Settings</Sidebar.MenuTitle>
          <Sidebar.Group>
            <Sidebar.GroupLink href="#" iconBefore={<ShieldIcon />}>
              Security
            </Sidebar.GroupLink>
            <Sidebar.GroupLink href="#" iconBefore={<GroupIcon />} isActive>
              Users management
            </Sidebar.GroupLink>
            <Sidebar.GroupLink href="#" iconBefore={<LockIcon />}>
              Access management
            </Sidebar.GroupLink>
          </Sidebar.Group>
        </Sidebar.Menu>
      </Sidebar>
      <div className={styles.main}>
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
    </div>
  )
}
