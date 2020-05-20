import React, { useState } from "react"
import cx from "classnames"
import { useMediaQuery } from "react-responsive"
import { breakpoints } from "@sourceface/style"
import Avatar from "@sourceface/components/avatar"
import Breadcrumbs from "@sourceface/components/breadcrumbs"
import Burger from "@sourceface/components/burger"
import Header from "@sourceface/components/header"
import Nav from "@sourceface/components/nav"
import Sidebar from "@sourceface/components/sidebar"
import ContentIcon from "assets/content-line.svg"
import GroupIcon from "assets/group-line.svg"
import LockIcon from "assets/lock-line.svg"
import LogoutIcon from "assets/logout-line.svg"
import QuestionIcon from "assets/question-line.svg"
import SettingsIcon from "assets/settings-line.svg"
import ShieldIcon from "assets/shield-line.svg"
import StackIcon from "assets/stack-line.svg"
import styles from "./index.scss"

// when clicking on a user item in the list - display select list modal?

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
  {
    name: "Team",
    link: "/settings/users/team",
  },
]

// Mobile menu will be a separate component with nesting(tapping on a settings menu will produce a dropdown) which is sliding from a top

// will be getting current page object from Page provided context and depending on it will render the data in breadcrumbs and sidebar
export default ({ children }) => {
  const isLargeSize = useMediaQuery({ minWidth: breakpoints.lg })

  return isLargeSize ? <Large>{children}</Large> : <Initial>{children}</Initial>
}

function Initial({ children }) {
  const [isMenuActive, setMenuActive] = useState()

  return (
    <div className={cx(styles.root, isMenuActive && styles.menuActive)}>
      {isMenuActive && <Sidenav />}
      <Burger
        className={styles.burger}
        isActive={isMenuActive}
        size="compact"
        appearance="dark"
        onClick={() => setMenuActive(!isMenuActive)}
      />
      <Header className={styles.header} size="compact">
        Users management
        <Avatar value="A" />
      </Header>

      <div className={styles.main}>{children}</div>
    </div>
  )
}

function Large({ children }) {
  return (
    <div className={styles.root}>
      <Sidenav />
      <Header className={styles.header}>
        <Breadcrumbs items={items} />
        <Avatar value="A" />
      </Header>
      <div className={styles.main}>{children}</div>
    </div>
  )
}

function Sidenav() {
  return (
    <>
      <Nav appearance="dark" className={styles.nav}>
        <Nav.Logo />
        <Nav.Link href="#">
          <ContentIcon />
        </Nav.Link>
        <Nav.Link href="#">
          <QuestionIcon />
        </Nav.Link>
        <Nav.Link href="#">
          <StackIcon />
        </Nav.Link>
        <Nav.Link href="#">
          <SettingsIcon />
        </Nav.Link>
        <Nav.Link href="#">
          <LogoutIcon />
        </Nav.Link>
      </Nav>
      <Sidebar appearance="dark" className={styles.sidebar}>
        <Sidebar.Title>Settings</Sidebar.Title>
        <Sidebar.Group>
          <Sidebar.GroupTitle>Personal</Sidebar.GroupTitle>
          <Sidebar.GroupLink href="#" iconBefore={<ShieldIcon />}>
            Security
          </Sidebar.GroupLink>
        </Sidebar.Group>
        <Sidebar.Group>
          <Sidebar.GroupTitle>Organization</Sidebar.GroupTitle>
          <Sidebar.GroupLink href="#" iconBefore={<GroupIcon />} isSelected>
            Users management
          </Sidebar.GroupLink>
          <Sidebar.GroupLink href="#" iconBefore={<LockIcon />}>
            Access management
          </Sidebar.GroupLink>
        </Sidebar.Group>
      </Sidebar>
    </>
  )
}
